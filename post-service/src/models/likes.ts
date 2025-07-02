import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";

export interface ILike extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const likeSchema = new Schema<ILike>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    },
    { timestamps: true }
);

export const Like = mongoose.model<ILike>("Like", likeSchema);

export const validateLike = (data: any) => {
    const schema = Joi.object({
        user: Joi.string().required().messages({"any.required": "User ID is required"}),
        post: Joi.string().required().messages({"any.required": "Post ID is required"}),
    });

    return schema.validate(data);
};
