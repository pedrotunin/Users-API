const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

const LoggedAuth = require('../middlewares/LoggedAuth');
const AdminAuth = require('../middlewares/AdminAuth');
const SelfOrAdminAuth = require('../middlewares/SelfOrAdminAuth');

// Main route
router.get('/', async (req, res) => {
    res.json( { message: 'Hey! This is a user API!' } );
});

// UserController
router.get('/users', AdminAuth, UserController.findAllUsers);
router.get('/users/:id', SelfOrAdminAuth, UserController.findUser);
router.delete('/users/:id', AdminAuth, UserController.deleteUser);
router.post('/users', UserController.createUser);
router.put('/users/:id', SelfOrAdminAuth, UserController.updateUser);
router.post('/login', UserController.login);
router.post('/recoverPassword', UserController.recoverPassword);
router.post('/changePassword', UserController.changePassword);

module.exports = router;