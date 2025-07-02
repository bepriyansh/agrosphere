import { config } from "./config";

interface User {
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
}

interface EmailOptions {
    user: User;
    resetLink: string;
    expirationTime?: string;
}

interface EmailContent {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const generateMail = ({ 
    user, 
    resetLink, 
    expirationTime = "1 hour" 
}: EmailOptions): EmailContent => {
    const userName = user.name || user.firstName || user.email.split('@')[0];
    const appName = config.APP_NAME || 'Reactor AI';
    const fromEmail = config.FROM_MAIL || 'support@reactorai.com';

    const subject = `Reset Your ${appName} Password`;

    const textContent = `
Hello ${userName},

You are receiving this email because you (or someone else) have requested a password reset for your ${appName} account.

Please click on the following link or paste it into your browser to reset your password:

${resetLink}

This link will expire in ${expirationTime} for security reasons.

If you did not request this password reset, please ignore this email and your password will remain unchanged. Your account is still secure.

If you're having trouble with the link above, copy and paste the URL into your web browser.

Best regards,
The ${appName} Team

---
This is an automated message, please do not reply to this email.
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - ${appName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #003674;
            margin-bottom: 10px;
        }
        .title {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .reset-button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #003674;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .reset-button:hover {
            background-color: #002d5a;
        }
        .link-text {
            font-size: 14px;
            color: #666;
            word-break: break-all;
            margin-top: 15px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .security-note {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${appName}</div>
            <h1 class="title">Password Reset Request</h1>
        </div>
        
        <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            
            <p>You are receiving this email because you (or someone else) have requested a password reset for your ${appName} account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⏰ Important:</strong> This link will expire in <strong>${expirationTime}</strong> for security reasons.
            </div>
            
            <p class="link-text">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetLink}">${resetLink}</a>
            </p>
            
            <div class="security-note">
                <p><strong>🔒 Security Note:</strong> If you did not request this password reset, please ignore this email and your password will remain unchanged. Your account is still secure.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Best regards,<br>The ${appName} Team</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    return {
        from: `${appName} <${fromEmail}>`,
        to: user.email,
        subject,
        text: textContent,
        html: htmlContent
    };
};
