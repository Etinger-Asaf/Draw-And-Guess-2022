const Game = require("../models/GameModel");

// This req can only be execute when the word has been chosen and the draw was made (keep the word in redux and ship them together)

exports.setWordAndDraw = async (req, res) => {
  try {
    // Getting the amount of Game doc if it is 0 it will create a new doc, if it is 1 it will update the doc

    const gameDocNum = await Game.estimatedDocumentCount();

    const gameDoc = {
      timeOfCreation: Date.now(),
      draw: req.body.draw,
      word: req.body.word,
    };

    if (gameDocNum === 0) {
      await Game.create({
        ...gameDoc,
      });
    } else if (gameDocNum === 1) {
      let currentGameData = await Game.findOne();

      currentGameData.draw = req.body.draw;
      currentGameData.word = req.body.word;
      currentGameData.save();
    }

    res.status(200).json({
      status: "success",
      body: {
        message: "The draw and word has been upload",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCurrentDrawAndWord = async (req, res) => {
  try {
    const gameData = await Game.findOne();

    res.status(200).json({
      status: "success",
      body: {
        data: gameData,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteGame = async (req, res) => {
  try {
    await Game.deleteOne();

    res.status(200).json({
      status: "success",
      body: {
        message: "The game was deleted",
      },
    });
  } catch (err) {
    console.log(err);
  }
};
