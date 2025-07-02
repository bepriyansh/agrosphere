import { Router } from 'express';
import v1Router from './v1';

const router = Router();
router.use('/api/v1', v1Router);


// Health check route
router.get('/health', (_req, res) => {
  res.success({ message: 'Server is healthy' });
});

// Fallback 404 handler
router.use((_req, res) => {
  res.error(404, 'Path does not exist');
});

export default router;