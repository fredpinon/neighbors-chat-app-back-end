const mongoose = require('../db.js');

const chatRoomSchema = new mongoose.Schema({
  address: {type: String, unique: true, required: true},
  messages: {type: Array},
})

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

exports.createNewMessage = async data => {
  const {address, username, msg, name} = data;
  return ChatRoomModel.findOne({address}).then(chatRoom => {
    chatRoom.messages.push({
      from: username,
      msg,
      name,
      timestamp: Date.now(),
    })
    return chatRoom.save();
  })
}

exports.getMessages = async address => await ChatRoomModel.findOne({address});
