const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/neighbors-chat-app', {useMongoClient: true});
module.exports = mongoose;
