import { Request, Response } from 'express';
import database from '../config/database';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export class ProductsController {
  // Get all products
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, sortBy = 'created_at', order = 'desc', page = 1, limit = 10 } = req.query;
      
      let query = 'SELECT * FROM products WHERE 1=1';
      const queryParams: any[] = [];
      let paramIndex = 1;

      // Category filter
      if (category && category !== 'all') {
        query += ` AND category = $${paramIndex}`;
        queryParams.push(category);
        paramIndex++;
      }

      // Search filter
      if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      // Sorting
      const validSortFields = ['name', 'price', 'created_at', 'rating'];
      const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'created_at';
      const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortField} ${sortOrder}`;

      // Pagination
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limitNum, offset);

      // Execute query
      const result = await database.query(query, queryParams);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) FROM products WHERE 1=1';
      const countParams: any[] = [];
      let countParamIndex = 1;

      if (category && category !== 'all') {
        countQuery += ` AND category = $${countParamIndex}`;
        countParams.push(category);
        countParamIndex++;
      }

      if (search) {
        countQuery += ` AND (name ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
        countParams.push(`%${search}%`);
      }

      const countResult = await database.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      const response: ApiResponse = {
        status: 'success',
        message: 'Products retrieved successfully',
        data: result.rows,
        meta: {
          total,
          page: pageNum,
          limit: limitNum
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Get products error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve products'
      };
      res.status(500).json(response);
    }
  }

  // Get single product by ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const query = 'SELECT * FROM products WHERE id = $1';
      const result = await database.query(query, [id]);

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Product not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        message: 'Product retrieved successfully',
        data: result.rows[0]
      };

      res.json(response);
    } catch (error) {
      console.error('Get product error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve product'
      };
      res.status(500).json(response);
    }
  }

  // Get products by category
  static async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      const query = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
      const result = await database.query(query, [category]);

      const response: ApiResponse = {
        status: 'success',
        message: `Products in ${category} category retrieved successfully`,
        data: result.rows,
        meta: {
          total: result.rows.length
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Get products by category error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve products'
      };
      res.status(500).json(response);
    }
  }

  // Get featured products
  static async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const query = 'SELECT * FROM products WHERE rating >= 4.5 ORDER BY rating DESC, review_count DESC LIMIT 6';
      const result = await database.query(query);

      const response: ApiResponse = {
        status: 'success',
        message: 'Featured products retrieved successfully',
        data: result.rows
      };

      res.json(response);
    } catch (error) {
      console.error('Get featured products error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve featured products'
      };
      res.status(500).json(response);
    }
  }

  // Create new product (Admin only)
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name, description, price, originalPrice, image, images,
        category, stockQuantity, tags, origin, weight, ingredients
      } = req.body;

      const query = `
        INSERT INTO products (
          name, description, price, original_price, image, images, 
          category, stock_quantity, tags, origin, weight, ingredients
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const values = [
        name, description, price, originalPrice, image, images || [],
        category, stockQuantity || 0, tags || [], origin, weight, ingredients || []
      ];

      const result = await database.query(query, values);

      const response: ApiResponse = {
        status: 'success',
        message: 'Product created successfully',
        data: result.rows[0]
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create product error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to create product'
      };
      res.status(500).json(response);
    }
  }

  // Update product (Admin only)
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name, description, price, originalPrice, image, images,
        category, stockQuantity, inStock, tags, origin, weight, ingredients
      } = req.body;

      const query = `
        UPDATE products SET 
          name = $1, description = $2, price = $3, original_price = $4,
          image = $5, images = $6, category = $7, stock_quantity = $8,
          in_stock = $9, tags = $10, origin = $11, weight = $12,
          ingredients = $13, updated_at = CURRENT_TIMESTAMP
        WHERE id = $14 
        RETURNING *
      `;

      const values = [
        name, description, price, originalPrice, image, images || [],
        category, stockQuantity || 0, inStock !== undefined ? inStock : true,
        tags || [], origin, weight, ingredients || [], id
      ];

      const result = await database.query(query, values);

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Product not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        message: 'Product updated successfully',
        data: result.rows[0]
      };

      res.json(response);
    } catch (error) {
      console.error('Update product error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to update product'
      };
      res.status(500).json(response);
    }
  }

  // Delete product (Admin only)
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
      const result = await database.query(query, [id]);

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Product not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        message: 'Product deleted successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Delete product error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to delete product'
      };
      res.status(500).json(response);
    }
  }
}