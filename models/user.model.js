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
