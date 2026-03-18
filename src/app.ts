import express, { Request, Response } from 'express';
import requestLogger from './middleware/requestLogger';
import authRoutes from './routes/authRoutes';
import resourceRoutes from './routes/resourceRoutes';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

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

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;