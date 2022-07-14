import { useState } from "react";

import WinningPopup from "../reusable/WinningPopup";
import { io } from "socket.io-client";

const WaitingPlayer1 = () => {
  const [win, setWin] = useState(false);
  const [wrongGuess, setWrongGuess] = useState("");
  let ioURL = "http://127.0.0.1:8000";

  if (process.env.REACT_APP_ENVIRONMENT === "production") {
    ioURL = "";
  }
  const socket = io(ioURL);

  socket.on("connect", () => {});

  socket.on("allWin", () => {
    setWin(true);
  });

  socket.on("WrongGuessToDisplay", (wrongGuess) => {
    setWrongGuess(wrongGuess);
  });

  return (
    <div className="backgroundBoxColor">
      <h1>Waiting player 1</h1>
      <p>Waiting is a bummer, but that is part of the game..</p>
      {!win && wrongGuess.length > 0 && (
        <h2>The other player guess - {wrongGuess}</h2>
      )}
      <WinningPopup whereTo="/WaitingPlayer2" isOpen={win} />
    </div>
  );
};

export default WaitingPlayer1;
