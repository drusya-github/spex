import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password } = req.body;
  const errors: { field: string; message: string }[] = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
    errors.push({
      field: 'password',
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, and a number',
    });
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};