import { Request, Response, NextFunction } from 'express';

interface APIError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(err: APIError, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[${code}]`, err.message);

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error',
      code,
    },
  });
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
