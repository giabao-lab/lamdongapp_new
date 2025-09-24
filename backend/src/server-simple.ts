import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import config from './config/config';
import database from './config/database';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Lam Dong Specialties API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      users: '/api/v1/users',
      orders: '/api/v1/orders',
      cart: '/api/v1/cart',
    },
  });
});

// Simple test routes
app.get('/api/v1/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    data: {
      server: 'Lam Dong Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await database.testConnection();
    
    // Start the server
    app.listen(config.PORT, () => {
      console.log('🚀 Server running on port', config.PORT);
      console.log('📍 Environment:', config.NODE_ENV);
      console.log('🌍 Frontend URL:', config.cors.origin);
      console.log('📊 Health check: http://localhost:' + config.PORT + '/health');
      console.log('🔗 API base: http://localhost:' + config.PORT + '/api/v1');
      console.log('🧪 Test endpoint: http://localhost:' + config.PORT + '/api/v1/test');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📱 SIGTERM received, shutting down gracefully');
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📱 SIGINT received, shutting down gracefully');
  await database.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;