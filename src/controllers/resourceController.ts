import { NextFunction, Request, Response } from 'express';
import { createResource } from '../services/resourceService';
import { sendSuccess } from '../utils/response';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as { userId: string };
    const resource = await createResource({
      userId: user.userId,
      title: req.body.title,
      content: req.body.content,
    });

    sendSuccess(res, 201, 'Resource created successfully', { resource });
  } catch (error) {
    next(error);
  }
};