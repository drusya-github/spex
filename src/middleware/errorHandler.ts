import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

interface PgError extends Error {
  code?: string;
  detail?: string;
  status?: number;
}

const errorHandler = (
  err: PgError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.code === '23505') {
    res.status(409).json({
      success: false,
      message: 'User already exists',
    });
    return;
  }

  console.error('[APP ERROR]', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export default errorHandler;