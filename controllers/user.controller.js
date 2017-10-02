const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const chatRoomModel = require('../models/chatRoom.model');
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
    await chatRoomModel.createChatRoom(newUserDetails.address);
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
    if (e.message.includes('duplicate')) res.send(JSON.stringify('username already exists'));
    else res.send(JSON.stringify('something went wrong'));
  }
}

exports.login = async (req, res) => {
  if (req.token) {
    try {
      const decodedToken = await jwt.verify(req.token, secret);
      const user = await userModel.findUser(decodedToken.username);
      const toggledActive = await userModel.setOnline(user.username);
      const details = toggledActive.toObject();
      delete details.password;
      res.send({
        details,
        token: req.token
      });
      res.status(200);
    } catch (e) {
      console.log(e);
      if (e.message === 'jwt expired' || e.message === 'invalid signature') req.token = undefined;
    }
  } else {
    const basicAuth = req.headers.authorization.split(' ')[1];
    const decodedBasicAuth = Buffer.from(basicAuth, 'base64').toString("ascii");
    const [username, password] = decodedBasicAuth.split(':');
    try {
      let user = await userModel.findUser(username);
      if (user === null) throw new Error();
      const matching = await bcrypt.compare(password, user.password);
      if (matching) {
        const toggledActive = await userModel.setOnline(user.username);
        const details = toggledActive.toObject();
        delete details.password;
        const token = await jwt.sign({username}, secret, {expiresIn: 2502000});
        res.send({
          details,
          token
        });
        res.status(200);
      } else throw new Error();
    } catch (e) {
      console.log(e);
      res.send(JSON.stringify('wrong credentials'));
      res.status(401);
    }
  }
}

exports.logout = async (req, res) => {
  const username = req.params.username.substr(1);
  try {
    await userModel.setOffline(username);
    res.send(JSON.stringify('user inactive'));
  } catch (e) {
    console.log(e);
  }
}

exports.deleteUser = async (req, res) => {
  const username = req.params.username.substr(1);
  try {
    const deleted = await userModel.deleteUser(username);
    const nbOfUsersLeft = await userModel.getAllUsers(deleted.address);
    if (nbOfUsersLeft.length === 0) await chatRoomModel.deleteChatRoom(deleted.address);
    res.send(JSON.stringify('removed'));
  } catch (e) {
    console.log(e);
  }
}

exports.search = async (req, res) => {
  const address = Object.keys(req.query)
  .reduce((accum, item) => {
    const arr = req.query[item].split('_');
    accum += `${arr} `;
    return accum;
  }, '')
  .trim();
  try {
    const neighbors = await userModel.getAllUsers(address);
    res.send(JSON.stringify(neighbors.length));
  } catch (e) {
    console.log(e);
  }
};
