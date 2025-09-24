import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController-fixed';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// GET /api/v1/auth - Auth endpoints info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication API endpoints',
    endpoints: {
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      profile: 'GET /api/v1/auth/profile'
    }
  });
});

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
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
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
// router.get('/profile', authenticate, AuthController.getProfile);

// Update profile route (protected)
// router.put('/profile', [...], AuthController.updateProfile);

export default router;