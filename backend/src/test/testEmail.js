import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: "idojhirad@gmail.com",
        pass: "hbvc hgmt lqhm mmvs", // Replace with your App Password
    },
});

async function testEmail() {
    try {
        const info = await transporter.sendMail({
            from: "idojhirad@gmail.com",
            to: "idojhirad@gmail.com", // Replace with a valid email
            subject: "Test Email",
            text: "This is a test email sent using Nodemailer.",
        });
        console.log("Email sent successfully:", info.messageId);
    } catch (err) {
        console.error("Failed to send email:", err);
    }
}

testEmail();
