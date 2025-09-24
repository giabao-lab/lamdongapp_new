import { Router } from 'express';
import { query, param } from 'express-validator';
import database from '../config/database';
import { handleValidationErrors } from '../middleware/validation';
import { ApiResponse, Product, ProductQuery } from '../types';

const router = Router();

// Get all products
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('min_price').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('max_price').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('in_stock').optional().isBoolean().withMessage('In stock must be a boolean'),
  query('sort').optional().isIn(['name', 'price', 'rating', 'created_at']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
  // handleValidationErrors
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      min_price,
      max_price,
      in_stock,
      sort = 'created_at',
      order = 'desc'
    } = req.query as any;

    // Build WHERE clause
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      conditions.push(`category = $${paramCount}`);
      values.push(category);
    }

    if (search) {
      paramCount++;
      conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    if (min_price !== undefined) {
      paramCount++;
      conditions.push(`price >= $${paramCount}`);
      values.push(parseFloat(min_price));
    }

    if (max_price !== undefined) {
      paramCount++;
      conditions.push(`price <= $${paramCount}`);
      values.push(parseFloat(max_price));
    }

    if (in_stock !== undefined) {
      paramCount++;
      conditions.push(`in_stock = $${paramCount}`);
      values.push(in_stock === 'true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total products
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await database.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Build main query
    const mainQuery = `
      SELECT * FROM products 
      ${whereClause}
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    values.push(parseInt(limit), offset);

    const result = await database.query(mainQuery, values);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single product
router.get('/:id', [
  param('id').isUUID().withMessage('Product ID must be a valid UUID'),
  // handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;