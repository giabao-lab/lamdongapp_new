import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import database from '../config/database';
import config from '../config/config';
import { User, ApiResponse, AuthResponse } from '../types';

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
        } as ApiResponse<null>);
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
        } as ApiResponse<null>);
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
        { expiresIn: '7d' }
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
      } as ApiResponse<null>);
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
        } as ApiResponse<null>);
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
        } as ApiResponse<null>);
        return;
      }

      const user = userResult.rows[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        } as ApiResponse<null>);
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
        { expiresIn: '7d' }
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
      } as ApiResponse<null>);
    }
  }

  // Get current user profile
  static async getProfile(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse<null>);
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
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: userResult.rows[0]
      } as ApiResponse<Omit<User, 'password'>>);

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<null>);
    }
  }

  // Update user profile
  static async updateProfile(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        } as ApiResponse<null>);
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse<null>);
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
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updateResult.rows[0]
      } as ApiResponse<Omit<User, 'password'>>);

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<null>);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse<null>);
        return;
      }

      // Check if user has admin role (optional - remove if not needed)
      // if (req.user.role !== 'admin') {
      //   res.status(403).json({
      //     success: false,
      //     message: 'Access denied. Admin role required.'
      //   } as ApiResponse<null>);
      //   return;
      // }

      const usersResult = await database.query(
        `SELECT 
          id, email, name, phone, address, role, created_at, updated_at,
          (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as total_orders
         FROM users 
         ORDER BY created_at DESC`
      );

      const totalResult = await database.query('SELECT COUNT(*) FROM users');
      const total = parseInt(totalResult.rows[0].count);

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: usersResult.rows,
          total: total,
          stats: {
            totalUsers: total,
            newUsersThisWeek: usersResult.rows.filter((user: any) => 
              new Date(user.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            newUsersThisMonth: usersResult.rows.filter((user: any) => 
              new Date(user.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length
          }
        }
      } as ApiResponse<any>);

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<null>);
    }
  }

  // Delete user
  static async deleteUser(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        } as ApiResponse<null>);
        return;
      }

      // Check if user has admin role
      if (req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        } as ApiResponse<null>);
        return;
      }

      const userId = req.params.id;

      // Prevent admin from deleting themselves
      if (req.user.userId === parseInt(userId)) {
        res.status(400).json({
          success: false,
          message: 'Bạn không thể xóa tài khoản của chính mình'
        } as ApiResponse<null>);
        return;
      }

      // Check if user exists
      const userExists = await database.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );

      if (userExists.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        } as ApiResponse<null>);
        return;
      }

      // Delete user (cascade will delete related records)
      await database.query('DELETE FROM users WHERE id = $1', [userId]);

      res.json({
        success: true,
        message: 'User deleted successfully'
      } as ApiResponse<null>);

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      } as ApiResponse<null>);
    }
  }
}
