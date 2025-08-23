import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';

// Import middleware
import { corsMiddleware } from './middleware/cors.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import {
  globalErrorHandler,
  handleNotFound,
  requestLogger,
  securityHeaders
} from './middleware/errorHandler.js';

// Import routes
import apiRoutes from './routes/index.js';

/**
 * Express Application Setup
 */
const app = express();

/**
 * Trust proxy (important for rate limiting and IP detection)
 */
app.set('trust proxy', 1);

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(securityHeaders);

/**
 * CORS Configuration
 */
app.use(corsMiddleware);

/**
 * Request Parsing Middleware
 */
app.use(express.json({ 
  limit: '10mb',
  strict: true
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

/**
 * Logging Middleware
 */
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(requestLogger);

/**
 * Rate Limiting
 */
app.use(generalLimiter);

/**
 * Health Check Route (before API routes)
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DevAssist API',
    data: {
      service: 'DevAssist Backend',
      version: '1.0.0',
      description: 'AI-powered multi-role web IDE for African developers, teams, and SMEs',
      documentation: `${req.protocol}://${req.get('host')}/api/docs`,
      health: `${req.protocol}://${req.get('host')}/api/health`,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * Handle 404 - Not Found
 */
app.all('*', handleNotFound);

/**
 * Global Error Handler
 */
app.use(globalErrorHandler);

/**
 * Graceful Shutdown Handler
 */
const gracefulShutdown = (signal) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  // Close server
  if (app.server) {
    app.server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  if (app.server) {
    app.server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

export default app;
