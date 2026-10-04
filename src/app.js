const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const dbConnect = require("./config/database");

const app = express();

// parse all json
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
