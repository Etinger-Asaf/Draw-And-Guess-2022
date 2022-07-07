let mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  frontID: String,
  score: Number,
  timeOfCreation: Number,
  isItPlayer1: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
