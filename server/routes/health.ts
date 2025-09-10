import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    ts: Date.now(),
    uptime: process.uptime(),
    node: process.version,
  });
});

export default router;
