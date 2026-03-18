import pool from '../config/db';
import AppError from '../utils/AppError';

interface CreateResourceInput {
  userId: string;
  title: string;
  content?: string;
}

export const createResource = async ({
  userId,
  title,
  content,
}: CreateResourceInput) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

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