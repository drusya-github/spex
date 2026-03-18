import bcrypt from 'bcrypt';
import pool from '../config/db';

interface RegisterUserInput {
  email: string;
  password: string;
}

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
}

export const registerUserService = async ({
  email,
  password,
}: RegisterUserInput): Promise<RegisteredUser> => {
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
    [email, hashedPassword]
  );

  return result.rows[0];
};