import { Request, Response } from 'express';
import { createResource as createResourceService } from '../services/resourceService';

export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    const userId = (req as Request & { user?: { userId: string } }).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const resource = await createResourceService({
      userId,
      title,
      content,
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: {
        resource,
      },
    });
  } catch (error) {
    console.error('Create resource error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
    });
  }
};