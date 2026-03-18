import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          name,
          email,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};