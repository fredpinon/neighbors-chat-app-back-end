const userModel = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
  const address = req.params.chatRoom.substr(1);
  const users = await userModel.getAllUsers(address);
  if (users.length === 0) res.send(JSON.stringify('no users at this address'));
  else res.send(users);
}
