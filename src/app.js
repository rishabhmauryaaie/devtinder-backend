const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.get("/user", userAuth, (req, res) => {
  try {
    throw new Error("Some error");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong in get");
  }
});


// keep this end of the all routes
app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Server started in port 7777");
});
