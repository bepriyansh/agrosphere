import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthUser } from '../../middlewares/verification';
import { User } from '../../models/user';
import { config } from '../../utils/config';

const verifyJWTToken = (token: string, secret: string): JwtPayload | string | null => {
    try {
        return jwt.verify(token, secret);
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') return 'expired';
        return null;
    }
};


export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.error(401, "No refresh token provided");
            return;
        }

        const jwtSecret = config.JWT_SECRET as string;
        if (!jwtSecret) {
            throw new Error('JWT secret missing.');
        }

        const decoded = verifyJWTToken(refreshToken, jwtSecret);
        if (!decoded || decoded === 'expired') {
            res.error(401, "Token Expired");
        }

        const userData = decoded as AuthUser;
        let user = await User.findById(userData.id);
        if(!user){
            res.error(404, "User not found");
            return;
        }

        const newData = {id:user._id, role:user.role, username:user.username, profilePicture:user.profilePicture}
        const token = jwt.sign(
            newData,
            jwtSecret,
            { expiresIn: '15m' }
        );
        
        res.success({
            status: 200,
            data: {
                user: newData,
                accessToken: token
            },
            message: 'Token refreshed successfully'
        });
    } catch (err) {
        console.error('Error in refreshToken controller:', err);

        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred while creating the user.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
};
