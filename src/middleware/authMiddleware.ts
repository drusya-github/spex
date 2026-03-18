import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ''
    ) as jwt.JwtPayload & { userId: string; email: string };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};

export default authMiddleware;
export type { AuthenticatedRequest };