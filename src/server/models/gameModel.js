let mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  timeOfCreation: String,
  draw: String,
  word: String,
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
