import { Request, Response } from 'express';
import Profile from '../models/Profile';

export const getProfile = async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        namaToko: 'Gaafisto',
        description: '',
        alamatToko: '',
        kotaToko: '',
        provinsiToko: '',
        kodePos: ''
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { namaToko, description, alamatToko, kotaToko, provinsiToko, kodePos } = req.body;

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({ namaToko, description, alamatToko, kotaToko, provinsiToko, kodePos });
    } else {
      profile.namaToko = namaToko;
      profile.description = description;
      profile.alamatToko = alamatToko;
      profile.kotaToko = kotaToko;
      profile.provinsiToko = provinsiToko;
      profile.kodePos = kodePos;
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};