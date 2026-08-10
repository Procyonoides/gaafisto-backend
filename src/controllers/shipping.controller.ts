import { Request, Response } from 'express';
import Shipping from '../models/Shipping';

export const getShippings = async (req: Request, res: Response) => {
  try {
    const shippings = await Shipping.find().sort({ wilayah: 1 });
    res.json({
      shippings,
      total: shippings.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createShipping = async (req: Request, res: Response) => {
  try {
    const { wilayah, biaya, kurir } = req.body;

    const shipping = new Shipping({ wilayah, biaya, kurir });
    await shipping.save();

    res.status(201).json(shipping);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateShipping = async (req: Request, res: Response) => {
  try {
    const { wilayah, biaya, kurir } = req.body;

    const shipping = await Shipping.findByIdAndUpdate(
      req.params.id,
      { wilayah, biaya, kurir },
      { new: true, runValidators: true }
    );

    if (!shipping) {
      return res.status(404).json({ message: 'Shipping not found' });
    }

    res.json(shipping);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteShipping = async (req: Request, res: Response) => {
  try {
    const shipping = await Shipping.findByIdAndDelete(req.params.id);

    if (!shipping) {
      return res.status(404).json({ message: 'Shipping not found' });
    }

    res.json({ message: 'Shipping deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};