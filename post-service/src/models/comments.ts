import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";

export interface IComment extends Document {
    description:string;
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    aiReply?: string; 
    createdAt?: Date;
    updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
    {
        description: { type: String, required: true },
        aiReply: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    },
    { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);

export const validateComment = (data: any) => {
    const schema = Joi.object({
        description: Joi.string().required().messages({"any.required":"Description is required"}),
        aiReply: Joi.string(),
        user: Joi.string().required().messages({"any.required": "User ID is required for a comment."}),
        post: Joi.string().required().messages({"any.required": "Post ID is required for a comment."}),
    });

    return schema.validate(data);
};
