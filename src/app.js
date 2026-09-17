const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

// Handle Auth Middleware for all GET, POST... requests
app.use("/admin", adminAuth);
// app.use("/user", userAuth);   // we can write this middleware in line no 20 as /user has only one route

app.get("/admin/getAllData", (req, res) => {
  // Logic of fetching all data
  res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res) => {
  // Logic of fetching all data
  res.send("User deleted");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User Data sent!!");
});

app.listen(7777, () => {
  console.log("Server started in port 7777");
});
