const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// send connection request
requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  try {
    res.status(200).send("Connection request send!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong!");
  }
});

module.exports = requestRouter;
