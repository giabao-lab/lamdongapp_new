import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lam Dong Specialties API',
      version: '1.0.0',
      description: 'RESTful API for Lam Dong Specialties E-commerce Platform',
      contact: {
        name: 'Lam Dong App Team',
        email: 'support@dacsanlamdong.vn',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.dacsanlamdong.vn/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'Nguyễn Văn A',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              example: '0901234567',
            },
            address: {
              type: 'string',
              description: 'User address',
              example: 'Đà Lạt, Lâm Đồng',
            },
            role: {
              type: 'string',
              enum: ['customer', 'admin'],
              description: 'User role',
              example: 'customer',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Product name',
              example: 'Cà phê Arabica Đà Lạt',
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'Cà phê Arabica nguyên chất từ cao nguyên Đà Lạt',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Current price',
              example: 250000,
            },
            original_price: {
              type: 'number',
              format: 'float',
              description: 'Original price (if on sale)',
              example: 300000,
            },
            image: {
              type: 'string',
              description: 'Main product image URL',
              example: '/products/coffee-arabica.jpg',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Additional product images',
              example: ['/products/coffee-1.jpg', '/products/coffee-2.jpg'],
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'coffee',
            },
            in_stock: {
              type: 'boolean',
              description: 'Stock availability',
              example: true,
            },
            stock_quantity: {
              type: 'integer',
              description: 'Available quantity',
              example: 100,
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Average rating (0-5)',
              example: 4.8,
            },
            review_count: {
              type: 'integer',
              description: 'Number of reviews',
              example: 124,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Product tags',
              example: ['organic', 'premium', 'arabica'],
            },
            origin: {
              type: 'string',
              description: 'Product origin',
              example: 'Đà Lạt, Lâm Đồng',
            },
            weight: {
              type: 'string',
              description: 'Product weight',
              example: '500g',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Product ingredients',
              example: ['100% cà phê Arabica'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Order ID',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'User ID who placed the order',
              example: 1,
            },
            total: {
              type: 'number',
              format: 'float',
              description: 'Total order amount',
              example: 680000,
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status',
              example: 'pending',
            },
            shipping_address: {
              type: 'object',
              properties: {
                fullName: { type: 'string', example: 'Nguyễn Văn A' },
                phone: { type: 'string', example: '0901234567' },
                email: { type: 'string', example: 'user@example.com' },
                address: { type: 'string', example: '123 Đường ABC' },
                city: { type: 'string', example: 'Đà Lạt' },
                district: { type: 'string', example: 'Phường 1' },
                ward: { type: 'string', example: 'Xã 1' },
              },
            },
            payment_method: {
              type: 'string',
              enum: ['cod', 'bank_transfer'],
              description: 'Payment method',
              example: 'cod',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Giao vào buổi sáng',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints (Admin only)',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
