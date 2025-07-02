import { Router } from 'express';
import { getComments } from '../../controllers/comment/comments';
import { createComment, deleteComment, updateComment } from '../../controllers/comment';

const router = Router();

router.get('/get', getComments);
router.post('/create', createComment);
router.patch('/update', updateComment);
router.delete('/delete', deleteComment);

export default router;