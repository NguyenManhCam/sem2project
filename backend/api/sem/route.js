const express = require("express");
const semController = require("./controller");

const route = express.Router();

route.post("/", async (req, res) => {
  semController
    .createSem(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

route.get("/", async (req, res) => {
  semController
    .getAllSem()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

route.get("/numOfSem/:num", (req, res) => {
  semController
    .getOneSem(req.params.num)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

route.delete("/", (req, res) => {
  semController
    .deleteAll()
    .then(data => res.json({ success: 1, message: "deleted" }))
    .catch(err => res.status(500).send(err));
});

module.exports = route;
