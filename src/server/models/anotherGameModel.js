let mongoose = require("mongoose");

const anotherGameSchema = new mongoose.Schema({
  anotherGame: {
    type: Boolean,
    default: false,
  },
});

const AnotherGame = mongoose.model("AnotherGame", anotherGameSchema);

module.exports = AnotherGame;
