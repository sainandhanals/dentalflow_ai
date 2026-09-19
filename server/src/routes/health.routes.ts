import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

const checkHealth = async () => {
  let dbStatus = 'healthy';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'unreachable';
  }
  return {
    success: true,
    status: 'online',
    message: 'DentalFlow AI API is running and operational',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    availableEndpoints: [
      'GET  /api',
      'GET  /api/health',
      'GET  /api/patients',
      'GET  /api/enquiries',
      'GET  /api/appointments',
      'GET  /api/follow-ups',
      'GET  /api/waitlist',
      'GET  /api/households',
      'GET  /api/treatment-plans',
      'GET  /api/reviews',
      'GET  /api/analytics/overview',
      'POST /api/ai/lead-classification',
      'POST /api/ai/no-show-prediction',
      'POST /api/ai/waitlist-match',
      'POST /api/ai/household-bundling',
      'POST /api/ai/treatment-nudges',
      'POST /api/ai/review-response',
    ],
  };
};

// Root endpoint for /api
router.get('/', async (req: Request, res: Response) => {
  const result = await checkHealth();
  res.json(result);
});

// Explicit health check endpoint for /api/health
router.get('/health', async (req: Request, res: Response) => {
  const result = await checkHealth();
  res.json(result);
});

export default router;
