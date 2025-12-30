import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../models/db.js';
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // 'client' or 'vendeur'
        phone: phone || null,
        storeName: role === 'vendeur' ? storeName : null,
        address: role === 'vendeur' ? address : null,
        storePhoto: role === 'vendeur' ? storePhoto : null,
      }
    });

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
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('Login failed: User not found with email:', email);
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
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
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
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build update data
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (storeName && user.role === 'vendeur') updateData.storeName = storeName;
    if (address && user.role === 'vendeur') updateData.address = address;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
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
    const sellers = await prisma.user.findMany({
      where: { role: 'vendeur' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        storeName: true,
        address: true,
        storePhoto: true,
        createdAt: true,
      }
    });
    
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
    const seller = await prisma.user.findFirst({
      where: { 
        id: parseInt(id), 
        role: 'vendeur' 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        storeName: true,
        address: true,
        storePhoto: true,
        createdAt: true,
      }
    });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    res.json(seller);
  } catch (error) {
    console.error('Get seller by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
