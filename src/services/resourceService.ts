import pool from '../config/db';

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export const createResourceForUser = async (
  userId: string,
  title: string,
  content: string
): Promise<Resource> => {
  const query = `
    INSERT INTO resources (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at, updated_at
  `;

  const values = [userId, title, content];
  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getResourcesByUserId = async (
  userId: string
): Promise<Resource[]> => {
  const query = `
    SELECT id, user_id, title, content, created_at, updated_at
    FROM resources
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};