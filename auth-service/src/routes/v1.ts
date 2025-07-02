import { Router } from 'express';
import authRouter from './auth/auth';
import resetPasswordRouter from './auth/resetPassword';
import serviceRouter from './services'

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/auth/reset', resetPasswordRouter);
v1Router.use('/service', serviceRouter);

export default v1Router;
