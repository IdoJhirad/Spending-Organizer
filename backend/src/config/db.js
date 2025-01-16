import pkg from "pg"; 
const { Pool } = pkg; 
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import EventEmitter from "events";

const dbEvents = new EventEmitter();
// Resolve the certificate path
const certPath = path.resolve(process.cwd(), process.env.DB_SSL_CERT);

// PostgreSQL configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(certPath, "utf8"),
    },
};

// Create a pool instance
const pool = new Pool(config);

// Test the connection and emit events
(async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Database connected successfully");
        dbEvents.emit("connected"); // Emit connected event
    } catch (err) {
        console.error("Database connection error:", err);
        dbEvents.emit("error", err); // Emit error event
    }
})();

// Handle pool errors
pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client:", err);
    dbEvents.emit("error", err); // Emit error event for global errors
    process.exit(-1); // Exit the process on fatal error
});
export default {
    events: dbEvents,
    query: (text, params) => pool.query(text, params), // Standardized query method
    pool, // Export the pool for advanced use cases if needed
};