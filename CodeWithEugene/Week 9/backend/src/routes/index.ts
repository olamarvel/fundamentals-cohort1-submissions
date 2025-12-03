import { Router } from 'express';
import v2Routes from './v2.routes';

const router = Router();

router.use('/v2', v2Routes);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'legacybridge-backend',
    version: '1.0.0',
  });
});

export default router;


