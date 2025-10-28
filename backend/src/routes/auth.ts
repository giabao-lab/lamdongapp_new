import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Register route
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('phone')
    .optional()
    .isMobilePhone('vi-VN')
    .withMessage('Please provide a valid Vietnamese phone number'),
  handleValidationErrors
], AuthController.register);

// Login route
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
], AuthController.login);

// Get profile route (protected)
router.get('/profile', authenticate, AuthController.getProfile);

// Update profile route (protected)
router.put('/profile', [
  authenticate,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('phone')
    .optional()
    .isMobilePhone('vi-VN')
    .withMessage('Please provide a valid Vietnamese phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long'),
  handleValidationErrors
], AuthController.updateProfile);

// Get all users route (admin only)
router.get('/users', authenticate, AuthController.getAllUsers);

// Delete user route (admin only)
router.delete('/users/:id', authenticate, AuthController.deleteUser);

export default router;