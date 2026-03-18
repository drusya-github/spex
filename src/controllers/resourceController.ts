import { Request, Response, NextFunction } from 'express';
import {
  createResourceForUser,
  getResourcesByUserId,
} from '../services/resourceService';

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, content } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const resource = await createResourceForUser(userId, title, content);

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const resources = await getResourcesByUserId(userId);

    res.status(200).json({
      success: true,
      message: 'Resources fetched successfully',
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};