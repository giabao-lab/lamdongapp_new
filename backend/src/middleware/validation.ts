import { Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  
  next();
};

// User validation
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters')
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters')
];

// Product validation
export const validateProductCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Product description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('original_price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Original price must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('stock_quantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('origin')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Origin must be between 2 and 100 characters'),
  body('weight')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Weight must not exceed 20 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array')
];

export const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Product description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('original_price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Original price must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('origin')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Origin must be between 2 and 100 characters'),
  body('weight')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Weight must not exceed 20 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array')
];

// Order validation
export const validateOrderCreation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('shipping_address.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Recipient name must be between 2 and 50 characters'),
  body('shipping_address.phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('shipping_address.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('shipping_address.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('shipping_address.district')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('District must be between 2 and 50 characters'),
  body('shipping_address.ward')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ward must be between 2 and 50 characters'),
  body('payment_method')
    .isIn(['cod', 'bank_transfer'])
    .withMessage('Payment method must be either "cod" or "bank_transfer"')
];

// Common validations
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Sort field cannot be empty'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either "asc" or "desc"')
];

export const validateProductQuery = [
  ...validatePagination,
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category cannot be empty'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query cannot be empty'),
  query('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  query('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number'),
  query('in_stock')
    .optional()
    .isBoolean()
    .withMessage('in_stock must be a boolean value')
];