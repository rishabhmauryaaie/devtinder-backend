const express = require("express");

const app = express();

app.use("/user", (req, res) => {
  // Route Handler
  console.log("Handling the route user1")
  res.send("Route handler 1");
}, (req, res) => {
  console.log("Handling the route user 2!!")
  res.send("Route Handler 2")
})


app.listen(7777, () => {
  console.log("Server started in port 7777");
});
