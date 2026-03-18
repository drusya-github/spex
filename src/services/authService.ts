import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import pool from '../config/db';

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput): Promise<RegisteredUser> => {
  const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
  const existingUserResult = await pool.query(existingUserQuery, [email]);

  if (existingUserResult.rows.length > 0) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const insertUserQuery = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email
  `;

  const result = await pool.query(insertUserQuery, [name, email, passwordHash]);

  return result.rows[0];
};

export const loginUser = async ({
  email,
  password,
}: LoginUserInput): Promise<LoginResponse> => {
  const query = `
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    const error = new Error('Invalid email or password');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET as jwt.Secret,
  { expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'] }
);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};