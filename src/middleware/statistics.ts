import { Request, Response, NextFunction } from 'express';
import { Statistics } from '../models/Statistics';

export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || req.socket.remoteAddress;
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const currentTime = Math.floor(Date.now() / 1000);

    const existingStat = await Statistics.findOne({ ip, tanggal: today });

    if (existingStat) {
      await Statistics.updateOne(
        { ip, tanggal: today },
        {
          $inc: { hits: 1 },
          online: currentTime
        }
      );
    } else {
      await Statistics.create({
        ip,
        tanggal: today,
        hits: 1,
        online: currentTime
      });
    }

    next();
  } catch (error) {
    next();
  }
};