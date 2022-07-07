const AnotherGame = require("../models/anotherGameModel");

// getting value
exports.getAnotherGameValue = async (req, res) => {
  try {
    const anotherGame = await AnotherGame.find();
    const anotherGameValue = anotherGame[0].anotherGame;
    console.log("anotherGameValue", anotherGameValue);
    res.status(200).json({
      status: "success",
      body: {
        data: anotherGameValue,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// setting value

exports.setAnotherGameValue = async (req, res) => {
  try {
    const value = req.body.anotherGame;

    const isThereAnotherGameDoc = await AnotherGame.estimatedDocumentCount();

    if (isThereAnotherGameDoc === 0) {
      await AnotherGame.create({ anotherGame: false });
    } else {
      let anotherGameDoc = await AnotherGame.findOne();

      if (anotherGameDoc) {
        anotherGameDoc.anotherGame = value;
        anotherGameDoc.save();
      }
    }

    res.status(200).json({
      status: "success",
      body: {
        message: "Another game has been updated",
      },
    });
  } catch (err) {
    console.log(err);
  }
};
