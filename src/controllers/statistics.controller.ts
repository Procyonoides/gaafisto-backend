import { Request, Response } from 'express';
import { getStatistics } from '../models/Statistics';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await getStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};