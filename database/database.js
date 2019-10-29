const mongoose = require("mongoose");
const dbPath = "mongodb://vaskar:v123456@ds339968.mlab.com:39968/recipebank";

mongoose.connect(dbPath, {
    useNewUrlParser: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});

module.exports = mongoose;