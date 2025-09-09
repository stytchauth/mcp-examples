import { Router, Request, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Sprint Planner API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
