import { Request, Response, NextFunction } from 'express';
import { Comment } from '../../models/comments';
import { config } from '../../utils/config';
import { Types } from 'mongoose';

export type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export const getAIResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { aiResponse, metaData } = req.body;

    const text = aiResponse as string;
    const meta = metaData as JSONValue;

    if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
        res.error(400, 'metaData should be a JSON object.');
        return;
    }

    const metaObj = meta as { [key: string]: JSONValue };

    if ('postId' in metaObj) {
        const postId = metaObj['postId'];
        await commentByAI(postId as string, text);
    } else if ('commentId' in metaObj) {
        const commentId = metaObj['commentId'];
        await replyByAI(commentId as string, text);
    } else {
      console.log('No matching key found in metaData');
    }

    res.success({status: 200, message: 'AI response handled successfully'})
  } catch (err) {
    console.error('Error in getAIResponse controller:', err);
    if (err instanceof Error) {
        res.error(500, err.message)
    } else {
        res.error(500, 'Unknown server error.');
    }
  }
};

const commentByAI = async (postId: string, description: string): Promise<void> => {
    try {
        const userID = config.AI_ACCOUNT_USER_ID;

        if (!postId) {
            throw new Error('Post ID is required');
        }

        if (!Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid post ID format');
        }

        const postObjectId = new Types.ObjectId(postId);
        const userObjectId = new Types.ObjectId(userID);

        const newComment = new Comment({
            user: userObjectId,
            post: postObjectId,
            description,
        });

        await newComment.save();
        console.log('AI comment created successfully for post:', postId);
    } catch (err) {
        console.error('Error in commentByAI:', err);
        throw err;
    }
}

const replyByAI = async (commentId: string, aiReply: string): Promise<void> => {
    try {
        if (!commentId) {
            throw new Error('Comment ID is required');
        }

        if (!aiReply || aiReply.trim() === '') {
            throw new Error('AI reply content is required');
        }

        if (!Types.ObjectId.isValid(commentId)) {
            throw new Error('Invalid comment ID format');
        }

        const commentObjectId = new Types.ObjectId(commentId);

        const updatedComment = await Comment.findByIdAndUpdate(
            commentObjectId,
            { $set: { aiReply: aiReply.trim() } },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            throw new Error('Comment not found');
        }

        console.log('AI reply added successfully to comment:', commentId);
    } catch (err) {
        console.error('Error in replyByAI:', err);
        throw err;
    }
}
