const express = require("express");
const User = require("../models/user");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of User model
    const user = new User({ ...req.body, password: passwordHash });

    const savedUser = await user.save();

    // const { password, ...userData } = savedUser.toObject();
    const { ...userData } = savedUser.toObject();

    res.status(201).send({
      message: "User created successfully!",
      data: userData,
    });
  } catch (err) {
    const { name, message, errors } = err;

    console.log(name, message, errors);

    res.status(500).send(message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // validate data
    validateLoginData(req);

    const { email, password } = req.body;

    const user = await User.findOne({ emailId: email }).select("+password");

    if (!user) {
      res.status(400).send("User not found!");
    }

    const result = user.validatePassword(password);
    if (!result) {
      res.status(400).send("Invalid Credentials");
    }

    const userObj = user.toObject();
    delete userObj.password;

    const token = user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 1 * 60),
      secure: true,
    });
    res.status(200).send({ message: "Login successfull", data: userObj });
  } catch (err) {
    const { name, message, errors } = err;
    console.log(name, message, errors);
    res.status(500).send(message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).send({ message: "Logout successfull" });
});

module.exports = authRouter;
