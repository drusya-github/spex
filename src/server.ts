import express from 'express';
import { env } from './config/env';

const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});