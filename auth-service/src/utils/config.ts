import dotenv from 'dotenv'
dotenv.config();

interface ConfigENV {
    Database: string;
    JWT_SECRET: string;
    PORT: string;
    CLIENT_URL: string;
    FROM_MAIL: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE: string;
    MAIL_USER: string;
    MAIL_PASSWORD: string;
    APP_NAME: string;
}

export const config: ConfigENV = {
    Database: process.env.Database || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    PORT: process.env.PORT || '',
    CLIENT_URL: process.env.CLIENT_URL || '',
    FROM_MAIL: process.env.FROM_MAIL || '',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '',
    SMTP_SECURE: process.env.SMTP_SECURE || '',
    MAIL_USER: process.env.MAIL_USER || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
    APP_NAME: process.env.APP_NAME || '',
}
