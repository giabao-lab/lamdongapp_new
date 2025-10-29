import { Router, Request, Response } from 'express';
import { query, param } from 'express-validator';
import database from '../config/database';
import { handleValidationErrors } from '../middleware/validation';
import { ApiResponse, Product, ProductQuery } from '../types';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with filtering, sorting, and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [coffee, tea, wine, fruits, preserves]
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name and description
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: in_stock
 *         schema:
 *           type: boolean
 *         description: Filter by stock availability
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, price, rating, created_at]
 *           default: created_at
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Internal server error
 */
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
], async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
// Get single product
router.get('/:id', [
  param('id').isUUID().withMessage('Product ID must be a valid UUID'),
  // handleValidationErrors
], async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - image
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cà phê Arabica Đà Lạt
 *               description:
 *                 type: string
 *                 example: Cà phê nguyên chất từ Đà Lạt
 *               price:
 *                 type: number
 *                 example: 250000
 *               original_price:
 *                 type: number
 *                 example: 300000
 *               image:
 *                 type: string
 *                 example: /products/coffee.jpg
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *                 example: coffee
 *               stock_quantity:
 *                 type: integer
 *                 example: 100
 *               origin:
 *                 type: string
 *                 example: Đà Lạt, Lâm Đồng
 *               weight:
 *                 type: string
 *                 example: 500g
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
// Create product (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      original_price,
      image,
      images,
      category,
      stock_quantity,
      origin,
      weight,
      tags,
      ingredients
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !image || !category) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    const in_stock = stock_quantity > 0;

    const query = `
      INSERT INTO products (
        name, description, price, original_price, image, images,
        category, in_stock, stock_quantity, origin, weight, tags, ingredients
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      name,
      description,
      price,
      original_price || null,
      image,
      images || [image],
      category,
      in_stock,
      stock_quantity || 0,
      origin || 'Đà Lạt, Lâm Đồng',
      weight || null,
      tags || [],
      ingredients || []
    ];

    const result = await database.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update product (admin only)
router.put('/:id', [
  param('id').isUUID().withMessage('Product ID must be a valid UUID')
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      original_price,
      image,
      images,
      category,
      stock_quantity,
      origin,
      weight,
      tags,
      ingredients
    } = req.body;

    // Check if product exists
    const checkResult = await database.query('SELECT id FROM products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    const in_stock = stock_quantity > 0;

    const query = `
      UPDATE products SET
        name = $1,
        description = $2,
        price = $3,
        original_price = $4,
        image = $5,
        images = $6,
        category = $7,
        in_stock = $8,
        stock_quantity = $9,
        origin = $10,
        weight = $11,
        tags = $12,
        ingredients = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      name,
      description,
      price,
      original_price || null,
      image,
      images || [image],
      category,
      in_stock,
      stock_quantity || 0,
      origin || 'Đà Lạt, Lâm Đồng',
      weight || null,
      tags || [],
      ingredients || [],
      id
    ];

    const result = await database.query(query, values);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete product (admin only)
router.delete('/:id', [
  param('id').isUUID().withMessage('Product ID must be a valid UUID')
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const checkResult = await database.query('SELECT id, name FROM products WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    // Delete product
    await database.query('DELETE FROM products WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id, name: checkResult.rows[0].name }
    });

  } catch (error: any) {
    console.error('Delete product error:', error);
    
    // Check for foreign key constraint violation
    if (error.code === '23503') {
      res.status(400).json({
        success: false,
        message: 'Cannot delete product. It is referenced in existing orders.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;