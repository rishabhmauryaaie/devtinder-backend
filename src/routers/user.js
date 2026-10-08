const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const userRouter = express.Router();

const SAFE_DATA = ["firstName", "lastName", "age", "gender", "about", "skills"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender about skills");

    res.status(200).json({
      message: "Requests fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
      status: "accepted",
    }).populate(
      "fromUserId toUserId",
      "firstName lastName age gender about skills",
    );

    const myConnections = connections.map((c) =>
      c.fromUserId._id.toString() === loggedInUser._id.toString()
        ? c.toUserId
        : c.fromUserId,
    );

    res.status(200).json({
      message: "Fetched your all connection successfully",
      data: myConnections,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 2;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });

    const feed = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUsersFromFeed),
          },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      message: "Fetch feed data successfully!",
      data: feed,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
