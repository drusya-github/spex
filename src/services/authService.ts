import bcrypt from 'bcrypt';
import pool from '../config/db';
import * as jwt from 'jsonwebtoken';

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginInput) => {
  const result = await pool.query(
    `SELECT id, email, password_hash FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
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