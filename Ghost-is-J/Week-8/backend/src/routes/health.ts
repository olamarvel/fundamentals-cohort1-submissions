import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version ?? '1.0.0',
    uptime: process.uptime()
  });
});

export default router;
