const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/neighbors-chat-app');

module.exports = mongoose;
