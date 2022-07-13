const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io", { rejectUnauthorized: false });
const express = require("express");
const app = require("./app");
dotenv.config({ path: "src/server/config.env" });
const DB = process.env.DB;
console.log("DB", DB);

mongoose.connect(DB).then(() => {
  console.log(`DB connection successful`);
});

const port = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// TEST
// app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "..", "..", "build")));
app.get("/", function (req, res, next) {
  try {
    res.sendFile(path.join(__dirname, "..", "..", "build", "index.html"));
  } catch (e) {
    console.log("e", e);
    res.status(400).json({
      status: "fail",
      data: e,
    });
  }
});
io.on("connection", (socket) => {
  socket.on("newDraw", () => {
    console.log("newDraw + newPolling back");
    socket.broadcast.emit("newPolling");
  });

  socket.on("win", () => {
    console.log("win");
    socket.broadcast.emit("allWin");
  });

  socket.on("wrongGuess", (wrongGuess) => {
    console.log("wrongGuess");
    socket.broadcast.emit("WrongGuessToDisplay", wrongGuess);
  });

  socket.on("player2IsJoined", () => {
    console.log("2 player has joined");
    socket.broadcast.emit("displayPlayer2Joined");
  });

  socket.on("backgroundColorChangeRed", () => {
    console.log("backgroundColorChangeRed back");
    socket.broadcast.emit("changeAppBackgroundColorRed");
  });

  socket.on("backgroundColorChangeYellow", () => {
    console.log("backgroundColorChangeYellow back");
    socket.broadcast.emit("changeAppBackgroundColorYellow");
  });

  socket.on("disconnect", (reason) => {
    // console.log(reason);

    socket.broadcast.emit("displayPlayerLeft");
  });
});

httpServer.listen(port);
