import express from 'express';
import { getStatus } from '../controllers/statusController';

const router = express.Router();

router.get('/', getStatus);

export default router;









