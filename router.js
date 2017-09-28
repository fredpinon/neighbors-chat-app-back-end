const express = require('express');
const router = express.Router();

const userController = require('./controllers/user.controller');

// active neighbors search
router.get('/search', userController.search);

// single user routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/logout/:username', userController.logOut);
router.delete('/deleteUser/:username', userController.deleteUser);







module.exports = router;
