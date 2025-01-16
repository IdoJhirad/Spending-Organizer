export const verification = {
    subject: "Email Verification",
    body: ({ name, token }) => `
        <p>Hi ${name},</p>
        
        <p>Click the button below to verify your email:</p>
        
        <a href="${process.env.BACKEND}/api/v1/auth/verify-email?token=${token}" 
            style="padding: 10px 20px; 
                   background-color: #007BFF; 
                   color: white; 
                   text-decoration: none; 
                   border-radius: 5px;">
            Verify Email
        </a>
        
        <p>This link will expire in 1 hour.</p>
        
        <p>If you didn't request this, you can safely ignore this email.</p>
    `,
};
export const passwordReset = {
    subject: "Password Reset Request",
    body: `Hi {{name}},\n\nYou requested to reset your password. Please click the link below to reset it:\n{{link}}\n\nIf you didn't request this, please ignore this email.`,
};
export const welcome = {
    subject: "Welcome to Our Platform!",
    body: `Hi {{name}},\n\nWelcome to our platform! We're excited to have you. Please let us know if you have any questions.`,
};
export const notification = {
    subject: "New Notification",
    body: `Hi {{name}},\n\nYou have a new notification: {{notification}}\n\nPlease log in to your account to view more details.`,
};
