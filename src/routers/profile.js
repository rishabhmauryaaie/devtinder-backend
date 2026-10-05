const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  validatePasswordProfileData,
} = require("../utils/validation");

const profileRouter = express.Router();

// user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    const { name, message, errors } = err;
    console.log(name, message, errors);
    res.status(500).send(message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.status(200).send({
      message: `${loggedInUser.firstName} your data updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    // Validate data
    validatePasswordProfileData(req);

    // User
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    // compare old password
    const result = await loggedInUser.validatePassword(oldPassword);
    if (!result) {
      res.status(400).send("Invalid Credentials");
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = passwordHash;
    await loggedInUser.save();

    // update data with new password
    res.status(200).send({
      message: `${loggedInUser.firstName}, your password has been changed!`,
      data: loggedInUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
