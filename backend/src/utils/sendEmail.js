import { createTransport } from "nodemailer";
import generateToken from "./generateToken.js";
import  {verification} from "../config/emailTemplates.js"
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from "dotenv";
dotenv.config(); 

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
    GOOGLE_REFRESH_TOKEN,
    OAUTH_EMAIL
} = process.env;
//OAuth2 client with  credentials
const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
);
//set refresh token
oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
})

async function createTransporter() {
    // Ask Google for a fresh "access token" using our refresh token
    const { token } = await oauth2Client.getAccessToken();

    //create transporter
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: OAUTH_EMAIL,
            accessToken: token,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN
        }
    });
}


export const sendEmail = async(receiverEmail,subject ,body) => {
   
    try {
        const transporter = await createTransporter();
        const mailOption = {
            from: OAUTH_EMAIL,
            to: receiverEmail,    
            subject: subject,
            html: body 
        };

        const info = await transporter.sendMail(mailOption);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};


export const sendVerificationEmail = async (user) => {
    try {
     
        // Generate a verification token
        const token = generateToken(user, true);

        // Prepare the email body
        const emailBody = verification.body({
            name: user.name,
            token,
        });

        // Send the email
        await sendEmail(user.email, verification.subject, emailBody);

        return { success: true, message: "Verification email sent successfully!" };
    } catch (err) {
        
        console.error("Error sending verification email:", err);
        return { success: false, message: "Failed to send verification email." };
    }
}; 





