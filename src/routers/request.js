const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
const { validateConnectionRequestData } = require("../utils/validation");

// send connection request
requestRouter.post(
  "/sendConnection/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // validate
      validateConnectionRequestData(req);

      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      // validate toUserId
      const validUser = await User.findById(toUserId);
      if (!validUser) {
        return res.status(404).send("User not found!");
      }

      // validate no existing connection request in db
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {fromUserId, toUserId},
          {fromUserId: toUserId, toUserId: fromUserId}
        ]
      })

      if(existingConnection) {
        return res.status(400).send("Connection request already sent!")
      }

      const connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      console.log("From User ID", fromUserId);
      console.log("To User ID", toUserId);
      console.log("Status", status);

      const connectionRequest = await connection.save();

      res.status(200).json({
        message: "Connection request successfull!",
        data: connectionRequest,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  },
);

module.exports = requestRouter;
