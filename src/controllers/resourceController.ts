import { Request, Response } from 'express';
import { createResource } from '../services/resourceService';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    const resource = await createResource({
      userId: req.user!.userId,
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
      message: 'Internal server error',
    });
  }
};