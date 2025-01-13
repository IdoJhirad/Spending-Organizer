const app = require("./app"); 
const dbConnection = require("./src/config/db");


// Check if the database connected successfully
dbConnection.on("connected", () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});

dbConnection.on("error", (err) => {
    console.error("Database connection error:", err);
});
