import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'password'>;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      // In a real app, you would fetch user from database
      // For now, we'll use the decoded token data
      req.user = {
        id: decoded.userId || decoded.id, // Support both userId and id
        email: decoded.email,
        name: decoded.name,
        phone: decoded.phone,
        address: decoded.address,
        role: decoded.role || 'user', // Default role
        created_at: decoded.created_at,
        updated_at: decoded.updated_at
      };

      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};