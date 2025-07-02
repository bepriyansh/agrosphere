import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";

export interface IUser extends Document {
    username?: string;
    email: string;
    password: string;
    role?: string;
    dob?: Date;
    profilePicture?: string; 
    resetPasswordToken?: string; 
    resetPasswordExpires?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, unique:[true, "Username already exists"] },
        email: { type: String, required: [true, "Email is required"], unique: [true, "Email already exists"] }, 
        password: { type: String, required: [true, "Password is required"] },
        role: { type: String, default: "user" },
        dob: { type: Date },
        profilePicture: { type: String }, 
        resetPasswordToken: { type: String }, 
        resetPasswordExpires: { type: Number }, 
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

export const validateUser = (data: any) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required().messages({
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required"
        }),
        password: Joi.string().required().messages({
            "any.required": "Password is required"
        }),
        role: Joi.string().optional(),
        dob: Joi.date().optional(),
        profilePicture: Joi.string().optional(),
        
        resetPasswordToken: Joi.string().optional(),
        resetPasswordExpires: Joi.number().optional(),
    });

    return schema.validate(data);
};
