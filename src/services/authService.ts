import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import pool from '../config/db';
import { AppError } from '../utils/AppError';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterUserInput {
  email: string;
  password: string;
}

export const registerUser = async ({ email, password }: RegisterUserInput) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      throw new AppError('Email already exists', 409, 'DUPLICATE_EMAIL');
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const result = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'AUTH_ERROR');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'AUTH_ERROR');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'] }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};