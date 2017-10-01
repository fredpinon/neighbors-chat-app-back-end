const mongoose = require('../db.js');
const randomColor = require('randomcolor');

const userSchema = new mongoose.Schema({
  fname: {type: String, lowercase: true, unique: false, required: true},
  lname: {type: String, lowercase: true, unique: false, required: true},
  username: {type: String, lowercase: true, unique: true, required: true},
  password: {type: String, required: true},
  address: {type: String, required: true},
  flat: {type: String, required: true},
  initials: {type: String, required: true},
  online: {type: Boolean, required: true},
  avatar_color: {type: String, required: true},
});

const UserModel = mongoose.model('user', userSchema);

exports.saveNewUser = newUserDetails => {
  const {fname, lname, username, password, address, flat, initials, online} = newUserDetails;
  const newUser = new UserModel({
    fname,
    lname,
    username,
    password,
    address,
    flat,
    initials,
    online,
    avatar_color: randomColor({luminosity:'light'}),
  });
  return newUser.save();
};

exports.setOnline = username => UserModel.findOneAndUpdate({username}, {$set:{online:true}}, {new:true});

exports.setOffline = username => UserModel.findOneAndUpdate({username}, {$set:{online:false}}, {new:true});

exports.findUser = username => UserModel.findOne({username});

exports.deleteUser = username => UserModel.findOneAndRemove({username});

exports.getAllUsers = address => UserModel.find({address}, {password:0});
