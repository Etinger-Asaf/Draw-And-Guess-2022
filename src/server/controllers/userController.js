const User = require("../models/userModel");

exports.setANewUser = async (req, res) => {
  try {
    // check if there is a doc on the user collection in the DB
    const userNum = await User.estimatedDocumentCount();
    console.log("userNum", userNum);

    const userCreationSchema = {
      frontID: req.body.playerID,
      timeOfCreation: Date.now(),
    };

    if (userNum === 0) {
      await User.create({
        isItPlayer1: true,
        ...userCreationSchema,
      });
    } else if (userNum === 1) {
      await User.create({
        isItPlayer1: false,
        ...userCreationSchema,
      });
    } else {
      console.log("This is when I have I have 2 DOCS");
      //   here I need to create logic to present the user that the game is only for 2 players and there are 2
    }

    // res
    res.status(200).json({
      status: "success",
      body: {
        message: "The user was created",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.deleteMany({});

    res.status(200).json({
      status: "success",
      body: {
        message: "The user was delete",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.activeUsers = async (req, res) => {
  try {
    const activeUsers = await User.estimatedDocumentCount();

    res.status(200).json({
      status: "success",
      data: {
        activeUsers,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
