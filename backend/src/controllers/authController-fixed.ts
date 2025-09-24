import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import database from '../config/database';
import config from '../config/config';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

interface AuthResponse {
  user: any;
  token: string;
}

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        } as ApiResponse<any>);
        return;
      }

      const { email, password, name, phone, address } = req.body;

      // Check if user already exists
      const existingUserResult = await database.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUserResult.rows.length > 0) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        } as ApiResponse<any>);
        return;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const createUserResult = await database.query(
        `INSERT INTO users (email, password, name, phone, address) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, email, name, phone, address, role, created_at`,
        [email, hashedPassword, name, phone, address]
      );

      const user = createUserResult.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as any
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
      } as ApiResponse<AuthResponse>);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<any>);
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        } as ApiResponse<any>);
        return;
      }

      const { email, password } = req.body;

      // Find user by email
      const userResult = await database.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        } as ApiResponse<any>);
        return;
      }

      const user = userResult.rows[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        } as ApiResponse<any>);
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as any
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: { user: userWithoutPassword, token }
      } as ApiResponse<AuthResponse>);

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<any>);
    }
  }

  // Get current user profile
  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse<any>);
        return;
      }

      const userResult = await database.query(
        'SELECT id, email, name, phone, address, role, created_at, updated_at FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse<any>);
        return;
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: userResult.rows[0]
      } as ApiResponse<any>);

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<any>);
    }
  }

  // Update user profile
  static async updateProfile(req: any, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        } as ApiResponse<any>);
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse<any>);
        return;
      }

      const { name, phone, address } = req.body;

      const updateResult = await database.query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             phone = COALESCE($2, phone), 
             address = COALESCE($3, address),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 
         RETURNING id, email, name, phone, address, role, created_at, updated_at`,
        [name, phone, address, req.user.id]
      );

      if (updateResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse<any>);
        return;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updateResult.rows[0]
      } as ApiResponse<any>);

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<any>);
    }
  }
}