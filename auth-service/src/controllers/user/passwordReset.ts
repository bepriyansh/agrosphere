import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '../../models/user';
import { hashPassword } from '../../utils/bcrypt';
import sendEmail from '../../utils/sendMail';
import { config } from '../../utils/config';
import { generateMail } from '../../utils/generateMail';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.error(400, 'Email is required.');
            return;
        }

        const user = await User.findOne({ email: email.trim() });
        if (!user) {
            res.success({
                status: 200,
                data: null,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        const resetLink = `${config.CLIENT_URL}/reset-password/${resetToken}`;

        const mailData = generateMail({user, resetLink});

        // Using the actual sendEmail function
        await sendEmail(mailData);

        res.success({
            status: 200,
            data: null,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });

    } catch (err) {
        console.error('Error in forgotPassword controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during password reset request.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
};

export const validateResetToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.body;

        if (!token) {
            res.error(400, 'Token is required.');
            return;
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.error(400, 'Password reset token is invalid or has expired.');
            return;
        }

        res.success({
            status: 200,
            data: { isValid: true },
            message: 'Token is valid.'
        });

    } catch (err) {
        console.error('Error in validateResetToken controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during token validation.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
};


export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            res.error(400, 'Token and new password are required.');
            return;
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.error(400, 'Password reset token is invalid or has expired.');
            return;
        }

        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.success({
            status: 200,
            data: null,
            message: 'Your password has been reset successfully!'
        });

    } catch (err) {
        console.error('Error in resetPassword controller:', err);
        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during password reset.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
};
