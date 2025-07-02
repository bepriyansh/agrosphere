import { Router } from 'express';
import { forgotPassword, resetPassword, validateResetToken } from '../../controllers/user/passwordReset';
const router = Router();

router.post('/validateResetToken', validateResetToken);
router.post('/resetPassword', resetPassword);
router.post('/forgotPassword', forgotPassword);

export default router;