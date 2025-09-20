import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import config from './config/env.js';

// Middleware
import { corsMiddleware } from './middleware/cors.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import {
  globalErrorHandler,
  handleNotFound,
  requestLogger,
  securityHeaders
} from './middleware/errorHandler.js';

// Routes
import apiRoutes from './routes/index.js';

/**
 * Express Application Setup
 */
const app = express();
app.set('trust proxy', 1);

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"], // Needed for AI APIs
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));
app.use(securityHeaders);

/**
 * CORS
 */
app.use(corsMiddleware);

/**
 * Request Parsing
 */
app.use(express.json({ limit: '20mb', strict: true }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/**
 * Logging
 */
app.use(config.NODE_ENV === 'development' ? morgan('dev') : morgan('combined'));
app.use(requestLogger);

/**
 * Compression
 */
app.use(compression());

/**
 * Rate Limiting
 */
app.use(generalLimiter);

/**
 * Health Check
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
 * 404 Handler
 */
app.all('*', handleNotFound);

/**
 * Global Error Handler
 */
app.use(globalErrorHandler);

/**
 * Graceful Shutdown
 */
const gracefulShutdown = (signal) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  if (app.server) {
    app.server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...', err);
  if (app.server) {
    app.server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

export default app;
