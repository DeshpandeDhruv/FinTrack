import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('=== Signup Request ===');
    console.log('Request body:', req.body);
    const { username, email, password } = req.body;

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    console.log('Creating new user...');
    const user = new User({
      username,
      email,
      password
    });

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully:', { id: user._id, username: user.username, email: user.email });

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token generated successfully');

    const response = {
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };

    console.log('Sending response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('=== Login Request ===');
    console.log('Request body:', req.body);
    const { email, password } = req.body;

    // Find user
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', { id: user._id, email: user.email, username: user.username });

    // Check password
    console.log('Checking password...');
    console.log('Stored hashed password:', user.password);
    console.log('Attempting to compare with provided password');
    const isMatch = await user.comparePassword(password);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };

    console.log('Sending successful response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Protected route example
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

export default router; 