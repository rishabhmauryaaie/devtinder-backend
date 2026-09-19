const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");

const dbConnect = require("./config/db");

const app = express();

dbConnect()
  .then(() => {
    console.log("DB connection successful!");
    app.listen(7777, () => {
      console.log("Server started in port 7777");
    });
  })
  .catch((err) => {
    if (err) {
      console.log("Something went wrong to connect db!");
    }
  });

app.post("/signup", (req, res) => {
  try {
    const user = new User({
      firstName: "Snehil",
      lastName: "Maurya",
      emailId: "snehil@gmail.com",
      password: "Snehil@123",
      age: 27,
      gender: "Female",
      id: "3475a345adjfalt0435"
    });

    user.save();

    res.status(201).send("User created successfully!")
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong")
  }
});
