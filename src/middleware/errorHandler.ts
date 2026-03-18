import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (
  err instanceof SyntaxError &&
  'status' in err &&
  err.status === 400 &&
  'body' in err
) {
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

  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export default errorHandler;