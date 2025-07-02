import { Request, Response, NextFunction } from 'express';
import { JoiErrorDetail } from '../../utils/joi';
import { Comment, validateComment } from '../../models/comments';
import { Types } from 'mongoose';
import { Post } from '../../models/posts';
import { requestCommentReply } from '../../api/ai_service';

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userID = req.user?.id;
        const {askAI, ...commentData} = {user:userID, ...req.body};
        const { error } = validateComment(commentData);
        if (error) {
            res.error(400, error.details.map((d: JoiErrorDetail) => d.message).join(',\n'));
            return;
        }

        const { user, post, description } = commentData;
        const newComment = new Comment({
            user,
            post,
            description,
        });

        await newComment.save();
        if(askAI){
            await getPostAndCommentsThenReply(post, newComment._id as string, description);
        }
        res.success({
            status: 201,
            message: 'Comment created successfully'
        });
    } catch (err) {
        console.error('Error in createComment controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during Comment creation.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}


export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userID = req.user?.id;
        const { id: commentId, ...updateData } = req.body;

        if (!commentId) {
            res.error(400, 'Comment ID is required');
            return;
        }

        const { error } = validateComment({user:userID, ...req.body});
        if (error) {
            res.error(400, error.details.map((d: JoiErrorDetail) => d.message).join(',\n'));
            return;
        }

        
        const userData = req.user!;
        
        const comment = await Comment.findById(commentId);
        if(!comment){
            res.error(404, 'Comment not found or deleted.');
        }

        const commentOwner = comment?.user.toString();
        if(commentOwner !== userData.id){
            res.error(401, "Unautorised action.");
        }


        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            res.error(404, 'Comment not found');
            return;
        }

        res.success({
            status: 200,
            message: 'Comment updated successfully'
        });
    } catch (err) {
        console.error('Error in updateComment controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred while updating post.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}


export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData = req.user!;
        const commentId = req.body.id;

        if (!commentId) {
            res.error(400, 'Comment ID is required');
            return;
        }
        
        const comment = await Comment.findById(commentId);
        if(!comment){
            res.error(404, 'Comment not found or deleted.');
        }

        const commentOwner = comment?.user.toString();
        if(commentOwner !== userData.id){
            res.error(401, "Unautorised action.");
        }

        await Comment.findByIdAndDelete(commentId);
        res.success({
            status: 200,
            message: 'Comment deleted successfully'
        });
    } catch (err) {
        console.error('Error in deleteComment controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during post deletion.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}

const getPostAndCommentsThenReply = async (postIdString: string, commentId: string, description: string) => {
    try {
        const postId = new Types.ObjectId(postIdString);
        const post = await Post.findById(postId).lean();
        if (!post) {
            throw new Error("Post not found.");
        }
        const postData = { images: post.images, description: post.description };

        const filter = { post: postId };

        const comments = await Comment.find(filter)
            .sort({ createdAt: -1 })
            .limit(10);

        const commentData = comments.map((comment)=> {
            return {
                description: comment.description
            }
        });

        await requestCommentReply({post: postData, previousComments: commentData , description, commentId});
    } catch (error) {
        
    }
}