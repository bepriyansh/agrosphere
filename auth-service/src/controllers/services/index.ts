import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";

export const getUserDataByIds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userIds} = req.body;
         if (!Array.isArray(userIds) || userIds.length === 0) {
            res.error(400, 'userIds must be a non-empty array');
            return;
        }

        const users = await User.find({ _id: { $in: userIds } })
            .select('username profilePicture role') 
            .lean();

        res.success({status:200, data: {users: users.map((user)=>{
            return {id:user._id, username: user.username, profilePicture: user.profilePicture, role: user.role}
        })} });
    } catch (err) {
        console.error('Error in getUserDataByIds controller:', err);

        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred while fetching users.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}