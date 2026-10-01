const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");

const dbConnect = require("./config/database");

const app = express();

// parse all json
app.use(express.json());
app.use(cookieParser());

// login user
app.post("/login", async (req, res) => {
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

// register user
app.post("/signup", async (req, res) => {
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

// user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    const { name, message, errors } = err;
    console.log(name, message, errors);
    res.status(500).send(message);
  }
});

// send connection request
app.post("/sendConnection", userAuth, async (req, res) => {
  try {
    res.status(200).send("Connection request send!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong!");
  }
});

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
