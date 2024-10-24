import { Request, Response } from 'express';
import { userService } from '../services/users_service';
import argon2 from 'argon2';
import User from '../models/user';
import jwt from 'jsonwebtoken';

// Get all users from the database
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    if (users.length === 0) {
      res.status(404).json({ status: 'false', message: 'No users found' });
      return;
    }

    res.status(200).json({ status: 'true', data: users });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate email and password format
    if (!/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      res.status(400).json({ message: 'Password must contain at least 8 characters, one letter, and one number' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }

    // Hash password and save user
    const hashedPassword = await argon2.hash(password);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { username, email },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Handle user login
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ status: false, message: 'All fields are required to login' });
    return;
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      res.status(404).json({ status: false, message: "User account doesn't exist, kindly sign up" });
      return;
    }

    // Verify password
    const verifiedPassword = await argon2.verify(existingUser.password, password);
    if (!verifiedPassword) {
      res.status(404).json({ status: false, message: 'Incorrect password, authentication failed' });
      return;
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY as string, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: existingUser.id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(200).json({
      status: true,
      message: `User login successful, welcome ${existingUser.username}`,
      accessToken,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ status: false, message: 'An internal error occurred' });
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ status: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ status: true, message: `User with id ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: false, message: 'Error occurred while deleting the user.' });
  }
};
