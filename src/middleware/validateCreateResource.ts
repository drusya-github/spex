import { Request, Response, NextFunction } from 'express';

export const validateCreateResource = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['Request body must be a valid JSON object'],
    });
    return;
  }

  const { title, content } = req.body;
  const errors: string[] = [];

  if (title === undefined) {
    errors.push('title is required');
  } else if (typeof title !== 'string') {
    errors.push('title must be a string');
  } else if (title.trim().length === 0) {
    errors.push('title cannot be empty');
  }

  if (content !== undefined && typeof content !== 'string') {
    errors.push('content must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  req.body.title = title.trim();

  next();
};