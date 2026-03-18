import { NextFunction, Request, Response } from 'express';
import { createResource as createResourceService } from '../services/resourceService';

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    const resource = await createResourceService({
      userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: {
        resource,
      },
    });
  } catch (error) {
    next(error);
  }
};