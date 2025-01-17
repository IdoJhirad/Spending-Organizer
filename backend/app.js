import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // For security-related HTTP headers
import rateLimit from "express-rate-limit"; // For rate limiting requests
import('./src/middleware/googleAuth.js')
import v1Routing from "./src/v1Routing/v1Routing.js"; // Import v1Routing
const app = express();
console.log(process.env.ORIGIN); 
// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Security: Add security-related HTTP headers -Helmet is a middleware for Express that adds security-related HTTP headers to your responses
app.use(helmet());

// Security: Rate limiting to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Cross-Origin Resource Sharing (CORS) settings
// Allows specified origins, cookies, and headers for cross-origin requests
app.use(cors({
    origin: process.env.ORIGIN, // Allowed origin set in .env
    credentials: true, // Allow cookies
    exposedHeaders: ['X-Total-Count', 'Authorization'], // Headers that can be accessed by the client
    methods: ['GET', 'POST', 'PATCH', 'DELETE'] // Allowed HTTP methods
}));

app.use("/api/v1", v1Routing);


// Catches all errors and returns a consistent JSON response
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace (avoid logging sensitive data here)
    res.status(500).json({ error: "Internal server error" }); // Generic error message for clients
});


export default app;