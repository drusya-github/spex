import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { createResource, getResourcesByUserId } from '../services/resourceService';
import AppError from '../utils/AppError';

export const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { title, content } = req.body;

    const resource = await createResource({
      title,
      content,
      userId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyResources = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const resources = await getResourcesByUserId(req.user.userId);

    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};