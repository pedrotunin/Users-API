const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

const LoggedAuth = require('../middlewares/LoggedAuth');

// Main route
router.get('/', async (req, res) => {
    res.json( { message: 'Hey! This is a user API!' } );
});

// UserController
router.get('/users', UserController.findAllUsers);
router.get('/users/:key', UserController.findUser);
router.delete('/users/:id', UserController.deleteUser);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.post('/login', UserController.login);
router.post('/recoverPassword', UserController.recoverPassword);
router.post('/changePassword', UserController.changePassword);

module.exports = router;