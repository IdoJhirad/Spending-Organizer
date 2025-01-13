const { Pool } = require("pg");
require("dotenv").config();
// Create a connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Connect to the database
const connect = async () => {
    try {
        await pool.connect();
        console.log("Connected to PostgreSQL database");
    } catch (err) {
        console.error("Failed to connect to the database:", err);
        throw err;
    }
};

module.exports = {
    connect,
    query: (text, params) => pool.query(text, params), // Helper function for queries
};
