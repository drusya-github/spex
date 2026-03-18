import express, { NextFunction, Request, Response } from 'express';
import requestLogger from './middleware/requestLogger';
import authRoutes from './routes/authRoutes';
import resourceRoutes from './routes/resourceRoutes';
import errorHandler from './middleware/errorHandler';
import { sendError, sendSuccess } from './utils/response';

const app = express();

app.use(express.json());
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status?: number }).status === 400 &&
    'body' in err
  ) {
    return sendError(res, 400, 'Invalid JSON payload', 'INVALID_JSON');
  }

  next(err);
});

if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

app.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, 200, 'Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.use((_req: Request, res: Response) => {
  return sendError(res, 404, 'Route not found', 'NOT_FOUND');
});

app.use(errorHandler);

export default app;