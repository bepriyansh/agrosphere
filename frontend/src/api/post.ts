import { apiClient } from "./axios";
import { uploadImages } from "./cloudinary";
import type { CommentsResponse, FeedResponse, IPost } from "./types";

export const getFeed = async (page = 1, limit = 10): Promise<FeedResponse> => {
    try {
        const response = await apiClient.get('/post/get', {
            params: { page, limit },
        });
        const data = response.data.data;
        return {
            items: data.posts,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalItems: data.totalPosts,
        };
    } catch (error) {
        console.error('Failed to fetch feed:', error);
        throw error;
    }
};

export const getPostById = async (postId: string) : Promise<IPost> => {
    try {
        const response = await apiClient.get('/post/getById', {
            params: { postId },
        });
        const data = response.data.data;
        return data.post;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        throw error;
    }
}

export const getComments = async (postId: string, page = 1, limit = 10): Promise<CommentsResponse> => {
    if (!postId) throw new Error('Post ID is required to fetch comments.');

    try {
        const response = await apiClient.get(`/comment/get`, {
            params: { page, limit, postId },
        });
        const data = response.data.data;
        return {
            items: data.comments,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalItems: data.totalComments,
        };
    } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}:`, error);
        throw error;
    }
};

export const likePost = async(postId:string) =>{
    if (!postId) throw new Error('Post ID is required to like the post.');

    try {
        await apiClient.post('/post/like', { post: postId });
    } catch (error) {
        console.error(`Failed to like post ${postId}:`, error);
        throw error;
    }
}

export const addComment = async ({postId, description, askAI}:{postId:string, description:string, askAI: boolean}) => {
    try {
        await apiClient.post('/comment/create', {
            post:postId,
            description,
            askAI
        })
    } catch (error) {
        console.error(`Failed to like post ${postId}:`, error);
        throw error;
    }
}

export const createPost = async ({images, description}:{images:File[], description:string}) => {
    try {
        const imgUrls = await uploadImages(images);
        const response = await apiClient.post('/post/create', {description, images:imgUrls});
        console.log(response.data);
    } catch (error) {
        console.log("Error creating post: ", error)
        throw error;
    }
}

export const deletePost = async (id:string) => {
    try {
        await apiClient.delete('/post/delete', {
            data: { id }
        });
    } catch (error) {
        console.log('Failed to delete Post: ', error);
        throw error;
    }
}

export const deleteComment = async (id:string) => {
    try {
        await apiClient.delete('/comment/delete', {
            data: { id }
        });
    } catch (error) {
        console.log('Failed to delete Post: ', error);
        throw error;
    }
}