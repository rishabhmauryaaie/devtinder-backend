const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from req.cookies
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token!");
    }

    // Verify token
    const decodeToken = await jwt.verify(token, "Rishabh@123");
    const { _id } = decodeToken;

    // Find user inside db
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
