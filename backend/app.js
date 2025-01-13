require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet"); // For security-related HTTP headers
const rateLimit = require("express-rate-limit"); // For rate limiting requests

const app = express();

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
    exposedHeaders: ['X-Total-Count'], // Headers that can be accessed by the client
    methods: ['GET', 'POST', 'PATCH', 'DELETE'] // Allowed HTTP methods
}));

// Centralized Error Handling Middleware
// Catches all errors and returns a consistent JSON response
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace (avoid logging sensitive data here)
    res.status(500).json({ error: "Internal server error" }); // Generic error message for clients
});


module.exports = app;
