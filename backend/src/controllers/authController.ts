import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { AppError } from '../middleware/errorHandler';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function register(req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email, password, and name are required');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(409, 'USER_EXISTS', 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      name,
      passwordHash,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}
