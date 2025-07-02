import { Router } from 'express';
import { getUserDataByIds } from '../../controllers/services';

const router = Router();

router.post('/user/get', getUserDataByIds);

export default router;