import bcrypt from 'bcrypt';
import pool from '../config/db';
import { generateToken } from '../utils/jwt';

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export const loginUser = async ({
  email,
  password,
}: LoginUserInput): Promise<LoginResponse> => {
  const result = await pool.query(
    `SELECT id, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, user.email);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};