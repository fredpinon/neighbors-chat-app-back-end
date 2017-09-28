const mongoose = require('../db.js');

const chatRoomSchema = new mongoose.Schema({
  address: {type: String, unique: true, required: true},
  messages: {type: Array},
});

const ChatRoomModel = mongoose.model('chatRoom', chatRoomSchema);

exports.createChatRoom = async address => {
  const exists = await ChatRoomModel.findOne({address});
  if (exists !== null) return;
  const newChatRoom = new ChatRoomModel({
    address,
    messages: [],
  })
  newChatRoom.save();
}

// two following methods are called from socketEvents.js
exports.createNewMessage = async msgInfo => {
  const {address, username, message, name} = msgInfo;
  return ChatRoomModel.findOne({address}).then(chatRoom => {
    chatRoom.messages.push({
      from: username,
      message,
      name,
      timestamp: Date.now(),
    })
    return chatRoom.save();
  })
};

exports.getMessages = async address => await ChatRoomModel.findOne({address});
