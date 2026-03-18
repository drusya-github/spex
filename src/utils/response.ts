import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  code = 'ERROR',
  details?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details: details ?? null,
    },
  });
};