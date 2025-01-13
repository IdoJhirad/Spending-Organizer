const { Client } = require("pg");
const EventEmitter = require("events");
const fs = require("fs"); // Add this to import the File System module
const path = require("path"); // Add this to handle file paths

const dbEvents = new EventEmitter();
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

// Create a client instance
const client = new Client(config);

// Connect to PostgreSQL
client.connect()
    .then(() => {
        console.log("PostgreSQL connected");
        dbEvents.emit("connected");
    })
    .catch((err) => {
        console.error("PostgreSQL connection error:", err);
        dbEvents.emit("error", err);
    });

module.exports = dbEvents;


