const expess = require('express');
const userController = require('./controller');

const route = expess.Router();

route.post('/', (req, res) => {
    userController
    .createUser(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
});

route.get('/', (req, res) => {
    userController
    .getAllUsers()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
});

route.delete('/', (req, res) => {
    res.send(userController.deleteAll());
});

module.exports = route