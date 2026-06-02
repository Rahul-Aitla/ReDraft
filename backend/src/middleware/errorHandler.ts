import { Request, Response, NextFunction } from 'express';

interface APIError extends Error {
  statusCode?: number;
  code?: string;
  name: string;
  errors?: any[];
}

export function errorHandler(err: APIError, _req: Request, res: Response, _next: NextFunction): void {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'Internal server error';
  let details: any[] | undefined = undefined;

  // Handle Sequelize validation / unique constraint errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    details = err.errors?.map((e: any) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    })) || [];
    message = `Validation failed: ${details.map(d => `${d.field} (${d.message})`).join(', ')}`;
  } else if (err.name?.startsWith('Sequelize')) {
    code = 'DATABASE_ERROR';
    message = `Database error: ${err.message}`;
  }

  // Print stack trace and details in console
  console.error(`\n❌ [${code}] ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }
  if (details && details.length > 0) {
    console.error('Validation Details:', JSON.stringify(details, null, 2));
  }

  res.status(statusCode).json({
    error: {
      message,
      code,
      details,
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
