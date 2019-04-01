const express = require("express");
const authController = require("./controller");

const route = express.Router();

route.get("/login" , (req, res) => {
  if(req.session.userInfo || req.session) res.json(req.session.userInfo)
  else res.send("")
});

route.post("/", (req, res) => {
  authController
    .login(req.body)
    .then(userInfo => {
      req.session.userInfo = userInfo;
      res.send(userInfo)
    })
    .catch(error => res.status(error.status).send(error.err));
});

route.delete("/", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

module.exports = route;