import bcrypt from "bcryptjs"; 
import sanitizeUser from "../utils/sanitizeUser.js";
import generateToken from "../utils/generateToken.js";
import {sendVerificationEmail} from "../utils/sendEmail.js";
import db from "../config/db.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {

    const {email, name, password, phone_number} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ message: "Missing required fileds." });
    }

    try {
        const emailExist = await db.query("SELECT id FROM users WHERE email = $1", [email]);
        if (emailExist.rows.length > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const encryptPassword = await bcrypt.hash(password, 10);
        
        const newUser = await db.query(
            "INSERT INTO users (email, name, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING id, email, phone_number, is_verified",
            [email, name, encryptPassword, phone_number] );
        
        const sanitizedUser = sanitizeUser(newUser.rows[0]);
        //send Verification mail
        const emailResult = await sendVerificationEmail(sanitizedUser);
        if (!emailResult.success) {
            return res.status(500).json({ message: "An unexpected error occurred. Please try again later" });
        }

        return res.status(201).json({
            message: "User registered successfully! Please check your email for verification."
        });
        
    } catch (err) {
        console.error("Error in user registration:", err);
        if (err.code === "23505") { // Unique violation error code in PostgreSQL
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Handle all other errors
        res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    if(!token) {
        return res.status(500).json({message: "Missing Token"})
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        //check user exsist
        const userQuery = await db.query(
            "SELECT id FROM users WHERE id = $1",
            [payload.id]
        );
        if (userQuery.rows.length === 0) {
            // User does not exist
            return res.status(404).json({ message: "User not found." });
        }

        //updste user verification
        await db.query(
            "UPDATE users SET is_verified = $1 WHERE id = $2",
            [true, payload.id]
        );
        res.redirect(`${process.env.ORIGIN}/login`);

    } catch (err) {
        console.error("Token verification failed:", err);
        res.redirect(`${process.env.ORIGIN}/login`);
    }

}


export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "Missing required fileds." });
    }
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid  password." });
        }
        const sanitizedUser = sanitizeUser(user.rows[0]);
        if(user.rows[0].is_verified == false) {

            const emailResult = await sendVerificationEmail(sanitizedUser);
            if (!emailResult.success) {
                return res.status(500).json({ message: "An unexpected error occurred. Please try again later" });
            } else {
                return res.status(403).json({
                    message: "Your account is not verified. A new verification email has been sent to your registered email address.",
                });
            } 
        }
        //generate token 
        const token = generateToken(sanitizedUser);
        //add token for header
        res.setHeader("Authorization", `Bearer ${token}`);
        return res.status(200).json({sanitizedUser});
    } catch (err) {
          console.error("Error during login:", err);

          return res.status(500).json({
              message: "An unexpected error occurred. Please try again later.",
          });
    }
}

export const logout = async (req, res) => {
    return res.status(200).json({ message: "Logged out successfully." });
}

export const checkAuth = async (req, res) => {
    return res.status(200).json({ message: "User is logged in." });
}

export const googleAuthCallback = async (req,res) => {
    const user = req.user; // Passport attaches the authenticated user to req.user
    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
  try {
    const sanitizedUser = sanitizeUser(user);
    // Generate JWT (if needed)
    const token = generateToken(sanitizedUser);

    // Set JWT in the response header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Respond with user info or redirect to dashboard
    return res.status(200).json({ sanitizedUser});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}