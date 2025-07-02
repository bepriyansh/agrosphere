import { config } from "../utils/config";
import { apiAIServiceClient } from "./axios";

interface NewPost {
    images: string[];
    description: string;
    postId: string;
};

interface IPost {
    images: string[];
    description: string;
};

interface IComment {
    description: string;
};

interface NewComment {
    post: IPost;
    previousComments: IComment[]; 
    description: string;
    commentId: string;
};

export const requestCommentOnNewPost = async ({images, description, postId}: NewPost) => {
    try {
        const prompt = config.AI_POST_COMMENT_PROMPT;
        const postContext = description;

        const finalText = `${prompt}

        POST DESCRIPTION::
        ${postContext}
        `
        const reqBody = {
            imageUrls: images || [],
            text: finalText,
            metaData: { postId }
        };
        // console.log(reqBody);
        const response = await apiAIServiceClient.post('/store-post-data', reqBody)
        console.log(response.data);
    } catch (error) {
        console.log("Error while requesting comment on new post", error);
    }
}

export const requestCommentReply = async ({post, previousComments, description, commentId}: NewComment) => {
    try {
        const prompt = config.AI_COMMENT_REPLY_PROMPT;
        const replyTo = description;
        const postContext = post.description;
        const commentContext = previousComments.map(comment=>comment.description).join('\n\n');

        const finalText =  `${prompt} 

        COMMENT FOR WHICH YOU NEED TO FORM A REPLY :: 
        ${replyTo} 
        
        SOME CONTEXT FOR YOUR INFO ::

        - POST DESCRIPTION :: 
        ${postContext} 
        
        
        - SOME RECENT COMMENTS :: 
        ${commentContext}
        `
        const reqBody = {
            imageUrls: post.images || [],
            text: finalText || "",
            metaData: { commentId }
        };
        // console.log(reqBody);
        const response = await apiAIServiceClient.post('/store-post-data', reqBody)
        console.log(response.data);
    } catch (error) {
        console.log("Error while requesting reply for a comment", error);
    }
}