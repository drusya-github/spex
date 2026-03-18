import express, { Request, Response } from 'express';
import requestLogger from './middleware/requestLogger';

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

export default app;
