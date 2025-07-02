import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../../models/posts';
import { Like } from '../../models/likes';
import { Comment } from '../../models/comments';
import { getUserData, UserData } from '../../api/auth_service';

// Utility to fetch likes, comments, and user's like status
const getPostMetaData = async (postIds: Types.ObjectId[], currentUserId?: string) => {
    const [likes, comments, userLikes] = await Promise.all([
        Like.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: '$post', totalLikes: { $sum: 1 } } }
        ]),
        Comment.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: '$post', totalComments: { $sum: 1 } } }
        ]),
        currentUserId ? Like.find({ user: currentUserId, post: { $in: postIds } }).lean() : []
    ]);

    const likeMap = new Map(likes.map(like => [like._id.toString(), like.totalLikes]));
    const commentMap = new Map(comments.map(comment => [comment._id.toString(), comment.totalComments]));
    const likedPostIds = new Set(userLikes.map(like => like.post.toString()));

    return { likeMap, commentMap, likedPostIds };
};

// Process posts with user info and meta data
const processPostsWithUserData = async (posts: any[], currentUserId?: string) => {
    if (!posts?.length) return [];

    const userIds = [...new Set(posts.map(p => p.user?.toString()).filter(Boolean))];

    let usersMap = new Map();
    if (userIds.length) {
        try {
            const users = await getUserData(userIds);
            usersMap = new Map(users.map(user => [user.id.toString(), user]));
        } catch (error) {
            console.warn('Failed to fetch user data:', error);
        }
    }

    const postIds = posts.map(p => p._id);

    const { likeMap, commentMap, likedPostIds } = await getPostMetaData(postIds, currentUserId);

    return posts.map(post => {
        const postIdStr = post._id.toString();
        return {
            ...post,
            user: usersMap.get(post.user?.toString()) || { username: 'Unknown User', profilePicture: null },
            totalComments: commentMap.get(postIdStr) || 0,
            totalLikes: likeMap.get(postIdStr) || 0,
            isLiked: likedPostIds.has(postIdStr)
        };
    });
};

// Fetch Feed
export const getFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = Math.max(parseInt(req.query.page as string) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
        const skip = (page - 1) * limit;

        const [posts, totalPosts] = await Promise.all([
            Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Post.countDocuments()
        ]);

        const postsWithData = await processPostsWithUserData(posts, req.user?.id);

        res.success({
            status: 200,
            data: {
                posts: postsWithData,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts
            },
            message: 'Feed fetched successfully'
        });
    } catch (err) {
        console.error('Error in getFeed controller:', err);
        res.error(500, err instanceof Error ? err.message : 'Internal server error');
    }
};

// Fetch Post By ID
export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const postIdString = req.query.postId as string;
        if (!postIdString || !Types.ObjectId.isValid(postIdString)) {
            res.error(400, 'Invalid postId');
            return;
        }

        const postId = new Types.ObjectId(postIdString);

        const post = await Post.findById(postId).lean();
        if (!post) {
            res.error(404, 'Post not found.');
            return;
        }

        // Get User Data
        let userData:UserData = { id:"", username: 'Unknown User', profilePicture: null };
        if (post.user) {
            try {
                const users = await getUserData([post.user.toString()]);
                if (users?.length) userData = users[0];
            } catch (error) {
                console.warn('Failed to fetch user data:', error);
            }
        }

        // Get Likes & Comments
        const { likeMap, commentMap, likedPostIds } = await getPostMetaData([postId], req.user?.id);
        const postIdStr = postId.toString();

        const postWithMeta = {
            ...post,
            user: userData,
            totalComments: commentMap.get(postIdStr) || 0,
            totalLikes: likeMap.get(postIdStr) || 0,
            isLiked: likedPostIds.has(postIdStr)
        };

        res.success({
            status: 200,
            data: { post: postWithMeta },
            message: 'Post details fetched successfully'
        });
    } catch (err) {
        console.error('Error in getPostById controller:', err);
        res.error(500, err instanceof Error ? err.message : 'Internal server error');
    }
};
