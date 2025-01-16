import jwt from 'jsonwebtoken';
import pool from "../config/db.js";
import sanitizeUser from '../utils/sanitizeUser.js';

const verifyToken = async (req,res, next) => {
    //get the jwt from the header
    const authHeader = req.headers.authorization;

      // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid." });
    }
     // Extract the token
     const token = authHeader.split(" ")[1];
    try {
        const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);
        if(decodedInfo && decodedInfo.id) {
            //get the user
            const user = await pool.query("SELECT * FROM users WHERE id = $1",[decodedInfo.id]);
            // If user does not exist
            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            req.user = sanitizeUser(user.rows[0]);
            next();
        } else {
            return res.status(403).json({ message: "Invalid token payload." });
        }
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
}

export default verifyToken;