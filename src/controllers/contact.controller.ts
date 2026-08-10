import { Request, Response } from 'express';
import Contact from '../models/Contact';
import Message from '../models/Message';

export const getContact = async (req: Request, res: Response) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({});
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { sms, telpon, wa, email, facebook, twitter, instagram, youtube } = req.body;

    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({ sms, telpon, wa, email, facebook, twitter, instagram, youtube });
    } else {
      contact.sms = sms;
      contact.telpon = telpon;
      contact.wa = wa;
      contact.email = email;
      contact.facebook = facebook;
      contact.twitter = twitter;
      contact.instagram = instagram;
      contact.youtube = youtube;
      await contact.save();
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};