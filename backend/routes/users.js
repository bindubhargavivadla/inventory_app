var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUser);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.delete('/:id', usersController.deleteUsers);
router.put('/:id', usersController.updateUser);
router.post('/login', usersController.login);

module.exports = router;
