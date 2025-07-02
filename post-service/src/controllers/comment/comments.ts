import { Request, Response, NextFunction } from 'express';
import { Comment } from '../../models/comments';
import { getUserData } from '../../api/auth_service';

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = Math.max(parseInt(req.query.page as string) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
        const skip = (page - 1) * limit;
        const postId = req.query.postId as string;

        if (!postId) {
            res.error(400, 'postId is required in query.');
            return;
        }

        const [comments, totalComments] = await Promise.all([
            Comment.find({ post: postId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Comment.countDocuments({ post: postId })
        ]);

        const userIds = [
            ...new Set(comments.map(comment => comment.user?.toString()).filter(Boolean))
        ];

        let usersMap = new Map();
        if (userIds.length) {
            try {
                const users = await getUserData(userIds);
                usersMap = new Map(users.map(user => [user.id.toString(), user]));
            } catch (error) {
                console.warn('Failed to fetch user data:', error);
            }
        }

        const commentsWithUser = comments.map(comment => ({
            ...comment,
            user: usersMap.get(comment.user?.toString()) || {
                _id: 'unknown',
                username: 'Unknown User',
                profilePicture: null
            }
        }));

        res.success({
            status: 200,
            data: {
                comments: commentsWithUser,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments
            },
            message: 'Comments fetched successfully'
        });

    } catch (err) {
        console.error('Error in getComments controller:', err);
        res.error(500, err instanceof Error ? err.message : 'Internal server error');
    }
};
