const app = require("./app");
const db = require("./src/confige/db");

// Initialize the database and start the server
db.connect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
