import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    description:string;
    images:string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
    {
        description: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        images: { type: [String] }, 
    },
    { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", postSchema);

export const validatePost = (data: any) => {
    const schema = Joi.object({
        description: Joi.string().required().messages({"any.required":"Description is required"}),
        images:Joi.array().items(Joi.string()).optional().allow(null),
        user: Joi.string().required().messages({"any.required": "User ID is required to create a post."}),
    });

    return schema.validate(data);
};
