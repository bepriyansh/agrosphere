import { Request, Response, NextFunction } from 'express';
import { User, validateUser } from '../../models/user';
import { hashPassword, comparePassword } from '../../utils/bcrypt';
import { JoiErrorDetail } from '../../utils/joi';
import jwt from 'jsonwebtoken';
import { config } from '../../utils/config';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            res.error(400, error.details.map((d: JoiErrorDetail) => d.message).join(',\n'));
            return;
        }

        req.body.email = req.body.email.trim();
        req.body.username = req.body.username.trim();
        req.body.password = req.body.password.trim();

        let userwithemail = await User.findOne({ email: req.body.email });
        if (userwithemail) {
            res.error(400, 'User with this email already exists.');
            return;
        }
        let userwithusername = await User.findOne({username:req.body.username})
        if (userwithusername) {
            res.error(400, 'Username not available.');
            return;
        }
        if (req.body.role) {
            const validRoles = ['admin', 'user'];
            const restrictedRoles = ['admin'];
            if (restrictedRoles.includes(req.body.role)) {
                res.error(400, 'You cannot create a user with this role.');
                return;
            }
            if (!validRoles.includes(req.body.role)) {
                res.error(400, 'Invalid role.');
                return;
            }
        }

        const hashedPassword = await hashPassword(req.body.password);

        const newUser = new User({
            username: req.body?.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || 'user',
            dob: req.body?.dob
        });

        const savedUser = await newUser.save();

        const jwtSecret = config.JWT_SECRET as string;
        if (!jwtSecret) {
            throw new Error('JWT secret is not defined in environment variables (check your .env file).');
        }

        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role, username: savedUser.username },
            jwtSecret,
            { expiresIn: '15d' }
        );

        savedUser.toObject();

        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000, 
        });

        res.success({
            status: 201,
            data: { user: { id: savedUser._id, role: savedUser.role, username: savedUser.username }},
            message: 'User created successfully'
        });

    } catch (err) {
        console.error('Error in createUser controller:', err);

        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred while creating the user.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.error(400, 'Username and password are required.');
            return;
        }

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();


        const user = await User.findOne({ username: trimmedUsername });
        if (!user) {
            res.error(400, 'Invalid username or password.');
            return;
        }

        const passwordMatch = await comparePassword(trimmedPassword, user.password);
        if (!passwordMatch) {
            res.error(400, 'Invalid username or password.');
            return;
        }

        const jwtSecret = config.JWT_SECRET as string;
        if (!jwtSecret) {
            throw new Error('JWT secret is not defined in environment variables (check your .env file).');
        }

        const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            { expiresIn: '15d' }
        );

        res.cookie('refreshToken', token,  {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000, 
        });

        res.success({
            status: 200,
            data: { user: { id: user._id, username, role: user.role } },
            message: 'Login successful'
        });
    } catch (err) {
        console.error('Error in loginUser controller:', err);

        if (err instanceof Error) {
            res.error(500, err.message || 'An unexpected error occurred during login.');
        } else {
            res.error(500, 'An unknown internal server error occurred.');
        }
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    res.cookie('accessToken', null, {
        httpOnly: false,
        expires: new Date(0)
    });
    res.cookie('refreshToken', null, {
        httpOnly: true,
        expires: new Date(0)
    });
    res.success({
        status: 200,
        message: 'Logged out successfully'
    });
};