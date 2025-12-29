import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, getNextUserId } from '../models/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, storeName, address, storePhoto } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: getNextUserId(),
      name,
      email,
      password: hashedPassword,
      role, // 'client' or 'vendeur'
      phone,
      storeName: role === 'vendeur' ? storeName : undefined,
      address: role === 'vendeur' ? address : undefined,
      storePhoto: role === 'vendeur' ? storePhoto : undefined,
      createdAt: new Date(),
    };

    db.users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      console.log('Available users:', db.users.map(u => u.email));
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
export const getProfile = (req, res) => {
  try {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, storeName, address } = req.body;
    
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    if (name) db.users[userIndex].name = name;
    if (phone) db.users[userIndex].phone = phone;
    if (storeName && db.users[userIndex].role === 'vendeur') {
      db.users[userIndex].storeName = storeName;
    }
    if (address && db.users[userIndex].role === 'vendeur') {
      db.users[userIndex].address = address;
    }

    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all sellers
export const getSellers = async (req, res) => {
  try {
    const sellers = db.users
      .filter(user => user.role === 'vendeur')
      .map(({ password, ...seller }) => seller);
    
    res.json(sellers);
  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller by ID
export const getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = db.users.find(user => user.id === id && user.role === 'vendeur');
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    const { password, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    console.error('Get seller by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
