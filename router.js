const express = require('express');
const router = express.Router();

const userController = require('./controllers/user.controller');
const chatRoomController = require('./controllers/chatRoom.controller');

router.get('/search', userController.search);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/logout/:username', userController.logout);
router.delete('/deleteUser/:username', userController.deleteUser);

router.get('/getAllUsers/:chatRoom', chatRoomController.getAllUsers);

module.exports = router;
