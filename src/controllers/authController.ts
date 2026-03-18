import { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { sendSuccess } from '../utils/response';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    sendSuccess(res, 201, 'User registered successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    sendSuccess(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};