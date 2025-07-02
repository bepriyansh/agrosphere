import dotenv from 'dotenv'
dotenv.config();

interface ConfigENV {
    Database: string;
    JWT_SECRET:string;
    PORT: string;
    AUTH_SERVICE_URL: string;
    AI_SERVICE_URL: string;
    AI_POST_COMMENT_PROMPT: string;
    AI_COMMENT_REPLY_PROMPT: string;
    AI_ACCOUNT_USER_ID: string;
}

export const config: ConfigENV = {
    Database: process.env.Database || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    PORT: process.env.PORT || '',
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || '',
    AI_SERVICE_URL: process.env.AI_SERVICE_URL || '',
    AI_POST_COMMENT_PROMPT: process.env.AI_POST_COMMENT_PROMPT || '',
    AI_COMMENT_REPLY_PROMPT: process.env.AI_COMMENT_REPLY_PROMPT || '',
    AI_ACCOUNT_USER_ID: process.env.AI_ACCOUNT_USER_ID || '',
}
