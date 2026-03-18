import express from 'express';
import requestLogger from './middleware/requestLogger';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use('/api/auth', authRoutes);

export default app;