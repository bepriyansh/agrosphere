import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import { config } from "./config";

// Define an interface for the email options to provide strong typing
interface EmailOptions {
    from: string;
    to: string;
    text: string;
    subject: string;
    html: string;
}

const sendEmail = async ({ from, to, text, subject, html }: EmailOptions) => {
    try {
        // Explicitly define the transport options type for better type checking
        const transporter: Transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: parseInt(config.SMTP_PORT || '587', 10), 
            secure: config.SMTP_SECURE === 'true', 
            auth: {
                user: config.MAIL_USER,
                pass: config.MAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `${config.APP_NAME || "Reactor Ai"} <${from}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default sendEmail;
