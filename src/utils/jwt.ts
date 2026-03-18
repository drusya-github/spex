import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
}

export const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload: JwtPayload = {
    sub: userId,
    email,
  };

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'],
  });
};