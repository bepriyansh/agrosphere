import { Router } from 'express';
import { getAIResponse } from '../../controllers/ai_controllers';

const router = Router();

router.post('/ai', getAIResponse);

export default router;