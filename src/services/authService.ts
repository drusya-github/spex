import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const registerUser = async ({ email, password }: RegisterUserInput) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  if (existingUser.rows.length > 0) {
    throw new AppError('User already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
    `,
    [email, passwordHash]
  );

  return result.rows[0];
};

export const loginUser = async ({ email, password }: LoginUserInput) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};