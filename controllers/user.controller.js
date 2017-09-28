const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const chatRoom = require('../models/chatRoom.model');
const ctrlHelpers = require('./ctrlHelpers');
const secret = require('../secret');

exports.signup = async (req, res) => {
  const newUserDetails = Object.assign({}, req.body);
  const {fname, lname, password} = newUserDetails;
  const hashedPassword = await bcrypt.hash(password, 10);
  newUserDetails.password = hashedPassword;
  newUserDetails.initials = ctrlHelpers.createUserInitials(fname, lname);
  newUserDetails.online = false;
  try {
    await userModel.saveNewUser(newUserDetails);
    await chatRoom.createChatRoom(newUserDetails.address);
    const toggledActive = await userModel.setOnline(newUserDetails.username);
    const details = toggledActive.toObject();
    delete details.password;
    const token = await jwt.sign({username: details.username}, secret, {expiresIn: 2502000});
    res.send({
      details,
      token
    });
  } catch (e) {
    console.log(e);
    if (e.message.includes('duplicate')) res.send(JSON.stringify('email already exists'));
    else res.send(JSON.stringify('something went wrong'));
  }
};
