import { Router } from 'express';
import postRouter from './post/post'
import commentRouter from './comment/comment'
import { verifyToken } from '../middlewares/verification';
import serviceRouter from './services'

const v1Router = Router();

v1Router.use('/post', verifyToken, postRouter);
v1Router.use('/comment', verifyToken, commentRouter);
v1Router.use('/service', serviceRouter);

export default v1Router;
