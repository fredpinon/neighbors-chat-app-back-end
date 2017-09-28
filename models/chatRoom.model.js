const mongoose = require('../db.js');

const chatRoomSchema = new mongoose.Schema({
  address: {type: String, unique: true, required: true},
  messages: {type: Array},
});

const ChatRoomModel = mongoose.model('chatRoom', chatRoomSchema);
