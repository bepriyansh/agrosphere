import { Router } from 'express';
import { createUser, loginUser, logoutUser } from "../../controllers/user/auth";
import { refreshToken } from '../../controllers/user/refreshToken';

const router = Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refreshToken', refreshToken)

export default router;