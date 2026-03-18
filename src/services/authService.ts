import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import pool from '../config/db';

interface RegisterUserInput {
  email: string;
  password: string;
}

interface RegisteredUser {
  email: string;
}

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

export const registerUser = async ({
  email,
  password,
}: RegisterUserInput): Promise<RegisteredUser> => {
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  if (existingUser.rows.length > 0) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING email
    `,
    [email, passwordHash]
  );

  return result.rows[0];
};

export const loginUser = async ({
  email,
  password,
}: LoginUserInput): Promise<LoginResponse> => {
  const result = await pool.query(
    `
    SELECT id, email, password_hash
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    jwtSecret as jwt.Secret,
  {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'],
  }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};