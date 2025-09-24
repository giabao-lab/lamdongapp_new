import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running without database',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Test API endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    status: 'success',
    message: 'Lam Dong Specialties API v1.0',
    endpoints: {
      health: '/health',
      test: '/api/v1/test'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API test endpoint working',
    data: {
      server: 'Express.js',
      database: 'Not connected',
      timestamp: new Date().toISOString()
    }
  });
});

// Mock products endpoint
app.get('/api/v1/products', (req, res) => {
  res.json({
    status: 'success',
    message: 'Mock products data',
    data: [
      {
        id: '1',
        name: 'Cà phê Arabica Đà Lạt',
        price: 250000,
        category: 'coffee',
        image: '/vietnamese-arabica-coffee-beans-dalat.jpg'
      },
      {
        id: '2', 
        name: 'Trà Atisô Đà Lạt',
        price: 180000,
        category: 'tea',
        image: '/vietnamese-artichoke-tea-dalat.jpg'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', error);
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    const server = app.listen(config.PORT, () => {
      console.log('\n🚀 Server running successfully!');
      console.log(`📍 Environment: ${config.NODE_ENV}`);
      console.log(`🌍 Frontend URL: ${config.FRONTEND_URL}`);
      console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
      console.log(`🔗 API base: http://localhost:${config.PORT}/api/v1`);
      console.log(`🧪 Test endpoint: http://localhost:${config.PORT}/api/v1/test`);
      console.log(`📦 Products: http://localhost:${config.PORT}/api/v1/products`);
      console.log('⚠️  Database: Not connected (running without DB)\n');
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('\n📱 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();