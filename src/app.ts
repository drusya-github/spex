import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes';
import resourceRoutes from './routes/resourceRoutes';
import requestLogger from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

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