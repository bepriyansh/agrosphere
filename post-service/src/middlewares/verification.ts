import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';

export interface AuthUser {
    id:string;
    username:string;
    role:string;
    profilePicture?:string;
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.error(401, "Unauthorized - Token not found");
        return;
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET!);
        req.user = decoded as AuthUser;
        next();
    } catch (error) {
        res.error(403, "Unauthorized - Invalid token")
    }
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    // Will implement this later
    next();
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        res.error(403, "Unauthorized - Admin required");
        return;
    }
    next();
};
