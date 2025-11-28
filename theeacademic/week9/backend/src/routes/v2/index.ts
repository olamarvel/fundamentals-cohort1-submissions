import { Router } from 'express';
import paymentsRouter from './payments';
import customersRouter from './customers';
import { cacheService } from '../../utils/cache';
import { ApiResponse } from '../../types';

const router = Router();

router.use('/payments', paymentsRouter);
router.use('/customers', customersRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  const response: ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
    cache: any;
  }> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      cache: cacheService.getStats(),
    },
    timestamp: new Date().toISOString(),
    version: 'v2',
  };

  res.json(response);
});

export default router;