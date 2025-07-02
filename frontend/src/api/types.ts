export interface SignUpData {
    username: string;
    email: string;
    password: string;
    dob?: string; 
}

export interface LoginData {
    username: string;
    password: string;
}

export interface IUser {
    id: string;
    username: string;
    role?: string;
    profilePicture?: string;
}

export interface AuthResponse {
    user: IUser;
}

export interface IPost {
    _id: string;
    description: string;
    images: string[];
    user: IUser; 
    isLiked: boolean;
    totalLikes: number;
    totalComments: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: string;
    description: string;
    aiReply: string;
    user: IUser; 
    post: string; 
    createdAt: string;
    updatedAt: string;
}

interface PaginatedResponse<T> {
    items: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export type FeedResponse = PaginatedResponse<IPost>;
export type CommentsResponse = PaginatedResponse<IComment>;
