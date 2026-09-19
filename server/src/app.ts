import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env';

const app = express();

// CORS configuration supporting local Vite frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        config.clientOrigin,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local hackathon demo
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development request logger
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Root server route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DentalFlow AI Backend API Server',
    apiRoot: '/api',
    healthCheck: '/api/health',
  });
});

// Mount all API endpoints under /api
app.use('/api', routes);

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl} - Route not found on DentalFlow API`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
