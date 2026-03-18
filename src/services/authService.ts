import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/db';
import AppError from '../utils/AppError';

interface RegisterUserInput {
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface SafeUser {
  id: string;
  email: string;
  created_at?: string;
}

export const registerUser = async ({
  email,
  password,
}: RegisterUserInput): Promise<SafeUser> => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError('User already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at
    `,
    [normalizedEmail, passwordHash]
  );

  return result.rows[0];
};

export const loginUser = async ({
  email,
  password,
}: LoginUserInput): Promise<{ token: string; user: SafeUser }> => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `
      SELECT id, email, password_hash, created_at
      FROM users
      WHERE email = $1
    `,
    [normalizedEmail]
  );

  if (result.rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    jwtSecret,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as SignOptions['expiresIn'],
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
  };
};

export const getCurrentUser = async (userId: string): Promise<SafeUser> => {
  const result = await pool.query(
    `
      SELECT id, email, created_at
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('User not found', 401);
  }

  return result.rows[0];
};