import { Request, Response, NextFunction } from 'express';
import { Post, validatePost } from '../../models/posts';
import { JoiErrorDetail } from '../../utils/joi';
import { Like, validateLike } from '../../models/likes';
import { requestCommentOnNewPost } from '../../api/ai_service';

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData = req.user!;
        const { error } = validatePost({user:userData.id, ...req.body});
        if (error) {
            res.error(400, error.details.map((d: JoiErrorDetail) => d.message).join(',\n'));
            return;
        }

        const { description, images } = req.body;
        const newPost = new Post({
            user:userData.id,
            description,
            images: images || []
        });

        await newPost.save();
        await requestCommentOnNewPost({images: newPost.images, description, postId: newPost._id as string});
        res.success({
            status: 201,
            message: 'Post created successfully'
        });
    } catch (err) {
        console.error('Error in createPost controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during post creation.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}


export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: postId, ...updateData } = req.body;

        if (!postId) {
            res.error(400, 'Post ID is required');
            return;
        }

        const { error } = validatePost(req.body);
        if (error) {
            res.error(400, error.details.map((d: JoiErrorDetail) => d.message).join(',\n'));
            return;
        }

        const userData = req.user!;

        const post = await Post.findById(postId);
        if(!post){
            res.error(404, 'Post not found or deleted.');
        }
        const postOwner = post?.user.toString();
        if(postOwner !== userData.id){
            res.error(401, "Unautorised action.");
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            res.error(404, 'Post not found');
            return;
        }

        res.success({
            status: 200,
            message: 'Post updated successfully'
        });
    } catch (err) {
        console.error('Error in updatePost controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred while updating post.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}


export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const postId = req.body.id;
        const userData = req.user!;

        if (!postId) {
            res.error(400, 'Post ID is required');
            return;
        }

        const post = await Post.findById(postId);
        if(!post){
            res.error(404, 'Post not found for deletion.');
        }

        const postOwner = post?.user.toString();
        if(postOwner !== userData.id){
            res.error(401, "Unautorised action.");
        }

        await Post.findByIdAndDelete(postId);

        res.success({
            status: 200,
            message: 'Post deleted successfully'
        });
    } catch (err) {
        console.error('Error in deletePost controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during post deletion.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}

export const likePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userID = req.user?.id;

        const { error } = validateLike({user:userID, ...req.body});
        if (error) {
            res.error(400, error.details.map((d: JoiErrorDetail) => d.message).join(',\n'));
            return;
        }

        const alreadyLiked = await Like.findOne({user:userID, ...req.body});
        if(alreadyLiked) {
            await Like.deleteOne({user:userID, ...req.body});
            res.success({status:200, message:"Like removed"});
        }else{
            await Like.create({user:userID, ...req.body});
            res.success({status:201, message:"Post Liked"});
        }
    } catch (err) {
        console.error('Error in likePost controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred while liking the post.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
}