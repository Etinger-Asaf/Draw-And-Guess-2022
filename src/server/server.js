const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = require("./app");
dotenv.config({ path: "src/server/config.env" });
const DB = process.env.DB;
console.log("DB", DB);

mongoose.connect(DB).then(() => {
  console.log(`DB connection successful`);
});

const port = process.env.PORT || 3000;

console.log(process.env.NODE_ENV);

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
  console.log("socket server side is connected", socket.id);

  socket.on("player2IsJoined", () => {
    console.log("2 player has joined");
    io.emit("displayPlayer2Joined");
  });
  
  socket.on("newDraw", () => {
    console.log("newDraw + newPolling back");
    socket.broadcast.emit("newPolling");
  });
 
  socket.on("win", () => {
    console.log("win");
    io.emit("allWin");
  });

  socket.on("wrongGuess", (wrongGuess) => {
    console.log("wrongGuess");
    io.emit("WrongGuessToDisplay", wrongGuess);
  });


  socket.on("backgroundColorChangeRed", () => {
    console.log("backgroundColorChangeRed back");
    io.emit("changeAppBackgroundColorRed");
  });

  socket.on("backgroundColorChangeYellow", () => {
    console.log("backgroundColorChangeYellow back");
    io.emit("changeAppBackgroundColorYellow");
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnect server");
    console.log(reason);
    io.emit("displayPlayerLeft");
  });
});

httpServer.listen(port);
