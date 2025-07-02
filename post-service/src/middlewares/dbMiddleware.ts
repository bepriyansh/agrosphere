import { Request, Response, NextFunction } from 'express';
import { checkDBConnection } from '../utils/mongodb';

export const dbMiddleware = async (_req: Request, _res: Response, next: NextFunction) => {
    await checkDBConnection();
    next();
};
