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

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  user_id: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  shipping_address: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  payment_method: 'cod' | 'bank_transfer';
}

export class OrdersController {
  // Create new order
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, items, shipping_address, payment_method } = req.body as CreateOrderRequest;
      
      // Validate required fields
      if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Missing required fields: user_id, items'
        };
        res.status(400).json(response);
        return;
      }

      // Use transaction for order creation
      const result = await database.transaction(async (client) => {
        // Calculate total from items
        let total = 0;
        for (const item of items) {
          // Verify product exists and get current price
          const productQuery = 'SELECT price, stock_quantity FROM products WHERE id = $1';
          const productResult = await client.query(productQuery, [item.product_id]);
          
          if (productResult.rows.length === 0) {
            throw new Error(`Product with ID ${item.product_id} not found`);
          }

          const product = productResult.rows[0];
          if (product.stock_quantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.product_id}`);
          }

          total += item.price * item.quantity;
        }

        // Create order
        const orderQuery = `
          INSERT INTO orders (
            user_id, total, status, shipping_address, payment_method
          ) VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;

        const orderValues = [
          user_id,
          total,
          'pending',
          JSON.stringify(shipping_address),
          payment_method
        ];

        const orderResult = await client.query(orderQuery, orderValues);
        const order = orderResult.rows[0];

        // Create order items
        for (const item of items) {
          const itemQuery = `
            INSERT INTO order_items (
              order_id, product_id, quantity, price
            ) VALUES ($1, $2, $3, $4)
          `;
          
          await client.query(itemQuery, [
            order.id,
            item.product_id,
            item.quantity,
            item.price
          ]);

          // Update product stock
          const updateStockQuery = `
            UPDATE products 
            SET stock_quantity = stock_quantity - $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
          `;
          
          await client.query(updateStockQuery, [item.quantity, item.product_id]);
        }

        return order;
      });

      // Fetch complete order with items
      const completeOrder = await OrdersController.getOrderWithItems(result.id);

      const response: ApiResponse = {
        status: 'success',
        message: 'Order created successfully',
        data: completeOrder
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create order error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create order'
      };
      res.status(500).json(response);
    }
  }

  // Get orders for a specific user
  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      
      let query = `
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'product_id', oi.product_id,
                   'quantity', oi.quantity,
                   'price', oi.price,
                   'product', json_build_object(
                     'id', p.id,
                     'name', p.name,
                     'image', p.image,
                     'price', p.price
                   )
                 )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
      `;
      
      const queryParams: any[] = [userId];
      let paramIndex = 2;

      if (status) {
        query += ` AND o.status = $${paramIndex}`;
        queryParams.push(status);
        paramIndex++;
      }

      query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

      // Add pagination
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limitNum, offset);

      const result = await database.query(query, queryParams);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM orders WHERE user_id = $1';
      const countParams = [userId];
      
      if (status) {
        countQuery += ' AND status = $2';
        countParams.push(status as string);
      }
      
      const countResult = await database.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      const response: ApiResponse = {
        status: 'success',
        message: 'Orders retrieved successfully',
        data: result.rows,
        meta: {
          total,
          page: pageNum,
          limit: limitNum
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Get user orders error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve orders'
      };
      res.status(500).json(response);
    }
  }

  // Get single order by ID
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const order = await OrdersController.getOrderWithItems(id);
      
      if (!order) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Order not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        message: 'Order retrieved successfully',
        data: order
      };

      res.json(response);
    } catch (error) {
      console.error('Get order error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve order'
      };
      res.status(500).json(response);
    }
  }

  // Update order status (Admin only)
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        };
        res.status(400).json(response);
        return;
      }

      const query = `
        UPDATE orders 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 
        RETURNING *
      `;

      const result = await database.query(query, [status, id]);

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Order not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        status: 'success',
        message: 'Order status updated successfully',
        data: result.rows[0]
      };

      res.json(response);
    } catch (error) {
      console.error('Update order status error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to update order status'
      };
      res.status(500).json(response);
    }
  }

  // Helper method to get order with items
  static async getOrderWithItems(orderId: string) {
    const query = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product', json_build_object(
                   'id', p.id,
                   'name', p.name,
                   'image', p.image,
                   'price', p.price
                 )
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
    `;

    const result = await database.query(query, [orderId]);
    return result.rows[0] || null;
  }

  // Get all orders (Admin only)
  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, status } = req.query;
      
      let query = `
        SELECT o.*, 
               u.name as user_name,
               u.email as user_email,
               COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE 1=1
      `;
      
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (status) {
        query += ` AND o.status = $${paramIndex}`;
        queryParams.push(status);
        paramIndex++;
      }

      query += ` GROUP BY o.id, u.name, u.email ORDER BY o.created_at DESC`;

      // Add pagination
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;
      const offset = (pageNum - 1) * limitNum;
      
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limitNum, offset);

      const result = await database.query(query, queryParams);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM orders WHERE 1=1';
      const countParams: any[] = [];
      
      if (status) {
        countQuery += ' AND status = $1';
        countParams.push(status as string);
      }
      
      const countResult = await database.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      const response: ApiResponse = {
        status: 'success',
        message: 'All orders retrieved successfully',
        data: result.rows,
        meta: {
          total,
          page: pageNum,
          limit: limitNum
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Get all orders error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to retrieve orders'
      };
      res.status(500).json(response);
    }
  }

  // Cancel order (User can cancel their own pending orders)
  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Get order first to verify ownership and status
      const orderQuery = 'SELECT * FROM orders WHERE id = $1';
      const orderResult = await database.query(orderQuery, [id]);
      
      if (orderResult.rows.length === 0) {
        const response: ApiResponse = {
          status: 'error',
          message: 'Order not found'
        };
        res.status(404).json(response);
        return;
      }

      const order = orderResult.rows[0];
      
      // Check if order can be cancelled (only pending orders)
      if (order.status !== 'pending') {
        const response: ApiResponse = {
          status: 'error',
          message: 'Only pending orders can be cancelled'
        };
        res.status(400).json(response);
        return;
      }

      // Update order status to cancelled using transaction
      const result = await database.transaction(async (client) => {
        // Update order status
        const updateQuery = `
          UPDATE orders 
          SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 
          RETURNING *
        `;
        const updateResult = await client.query(updateQuery, [id]);

        // Restore product stock quantities
        const itemsQuery = 'SELECT product_id, quantity FROM order_items WHERE order_id = $1';
        const itemsResult = await client.query(itemsQuery, [id]);

        for (const item of itemsResult.rows) {
          const restoreStockQuery = `
            UPDATE products 
            SET stock_quantity = stock_quantity + $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
          `;
          await client.query(restoreStockQuery, [item.quantity, item.product_id]);
        }

        return updateResult.rows[0];
      });

      const response: ApiResponse = {
        status: 'success',
        message: 'Order cancelled successfully',
        data: result
      };

      res.json(response);
    } catch (error) {
      console.error('Cancel order error:', error);
      const response: ApiResponse = {
        status: 'error',
        message: 'Failed to cancel order'
      };
      res.status(500).json(response);
    }
  }
}