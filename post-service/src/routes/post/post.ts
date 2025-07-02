import { Router } from 'express';
import { createPost, deletePost, likePost, updatePost } from '../../controllers/post';
import { getFeed, getPostById } from '../../controllers/post/feed';

const router = Router();

router.get('/get', getFeed);
router.get('/getById', getPostById);
router.post('/create', createPost);
router.post('/update', updatePost);
router.post('/like', likePost);
router.delete('/delete', deletePost);

export default router;