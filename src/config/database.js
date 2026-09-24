const mongoose = require("mongoose");

const dbConnect = async () => {
    await mongoose.connect("mongodb+srv://rishabhmauryaaie_db_user:kWNuu1EjEWPDb4xd@cluster0.gorweip.mongodb.net/");
}

module.exports = dbConnect;

