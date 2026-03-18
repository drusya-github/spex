import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return sendError(
      res,
      err.statusCode,
      err.message,
      err.code,
      err.details
    );
  }

  return sendError(
    res,
    500,
    'Internal server error',
    'INTERNAL_SERVER_ERROR'
  );
};

export default errorHandler;