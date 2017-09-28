const express = require('express');
const router = express.Router();

const userController = require('./controllers/user.controller');


// single user routes
router.post('/signup', userController.signup);










module.exports = router;
