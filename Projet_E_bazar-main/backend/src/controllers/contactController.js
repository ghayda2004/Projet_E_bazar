import { db, getNextContactId } from '../models/database.js';

// Submit contact form
export const submitContact = (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = {
      id: getNextContactId(),
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      status: 'unread',
    };

    db.contacts.push(newContact);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: newContact,
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all contacts (admin/seller only)
export const getAllContacts = (req, res) => {
  try {
    res.json(db.contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
