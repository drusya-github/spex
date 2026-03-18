import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool
  .connect()
  .then((client) => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

export default pool;