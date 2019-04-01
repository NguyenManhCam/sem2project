const express = require('express');
const classController = require('./controller');

const route = express.Router();

route.post('/', (req, res) => {
    classController
    .createClass(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
});

route.get('/', (req, res) => {
    classController
    .getAllClass()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
});

route.get('/:id', (req, res) => {
    classController
    .getOneClass(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
});

module.exports = route