import pool from '../config/db';

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
  const query = `
    INSERT INTO resources (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at, updated_at
  `;

  const values = [userId, title, content ?? null];

  const result = await pool.query(query, values);
  return result.rows[0];
};