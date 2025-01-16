import app from "./app.js"; 
import db from "./src/config/db.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// Check if the database connected successfully
db.events.on("connected", () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});

db.events.on("error", (err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the process if there's a fatal error
});