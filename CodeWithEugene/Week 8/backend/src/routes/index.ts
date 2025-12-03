import express from 'express';
import healthRouter from './health';
import statusRouter from './status';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/status', statusRouter);

export default router;









