const express = require("express");
const bcrypt = require("bcrypt");
const { adminAuth, userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");

const dbConnect = require("./config/database");

const app = express();

// parse all json
app.use(express.json());

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

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      res.status(400).send("Invalid Credentials");
    }

    const userObj = user.toObject();
    delete userObj.password;

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

// get user data by email id
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("User not found!");
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// feed api
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No user found!");
      return;
    }

    res.status(200).send(users);
  } catch (err) {
    const { name, message, errors } = err;
    console.log(name, message, errors);
    res.status(500).send(message);
  }
});

// delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(req.userId);
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});

// update user
app.patch("/user/", async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    console.log(user);
    res.status(200).send({
      message: "User updated successfully!",
      data: user,
    });
  } catch (err) {
    const { name, message, errors } = err;
    console.log(name, message, errors);
    res.status(500).send(message);
  }
});

// update user by email id
app.patch("/user/:email", async (req, res) => {
  const emailId = req.params.email;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10!");
    }

    const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send({
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    const { name, message, errors } = err;
    console.log(name, message, errors);
    res.status(500).send(message);
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
