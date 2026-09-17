const express = require("express");

const app = express();

const routeHandler1 = (req, res, next) => {
  console.log("Route Handler1")
  next();
}

const routeHandler2 = (req, res, next) => {
  console.log("Route Handler2")
  next();
}
const routeHandler3 = (req, res, next) => {
  console.log("Route Handler3")
  next();
}
const routeHandler4 = (req, res, next) => {
  console.log("Route Handler4")
  res.send("Route handler 4")
}

app.get("/route", routeHandler1, [routeHandler2, routeHandler3], routeHandler4);

app.use(
  "/user",
  (req, res, next) => {
    // Route Handler
    console.log("Handling the route user 1!!");
    next();
    // res.send("Route handler 1");
  },
  (req, res, next) => {
    console.log("Handling the route user 2!!");
    // res.send("Route Handler 2");
    next();
  },
  [
  (req, res, next) => {
    console.log("Handling the route user 3!!");
    // res.send("Route Handler 3");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 4!!");
    res.send("Route Handler 4");
    // next();
  }],
);

app.listen(7777, () => {
  console.log("Server started in port 7777");
});
