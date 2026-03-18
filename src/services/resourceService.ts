import pool from '../config/db';
import AppError from '../utils/AppError';

interface CreateResourceInput {
  title: string;
  content?: string;
  userId: string;
}

export const createResource = async ({
  title,
  content,
  userId,
}: CreateResourceInput) => {
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new AppError('Title is required', 400);
  }

  if (content !== undefined && typeof content !== 'string') {
    throw new AppError('Content must be a string', 400);
  }

  const result = await pool.query(
    `
      INSERT INTO resources (user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, title, content, created_at, updated_at
    `,
    [userId, title.trim(), content ?? null]
  );

  return result.rows[0];
};

export const getResourcesByUserId = async (userId: string) => {
  const result = await pool.query(
    `
      SELECT id, user_id, title, content, created_at, updated_at
      FROM resources
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};