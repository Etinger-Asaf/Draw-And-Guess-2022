import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WinningPopup from "../reusable/WinningPopup";

const WaitingPlayer1 = () => {
  const [win, setWin] = useState(false);
  const [wrongGuess, setWrongGuess] = useState("");
  
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    socket.on("allWin", () => {
      setWin(true);
    });

    socket.on("WrongGuessToDisplay", (wrongGuess) => {
      setWrongGuess(wrongGuess);
    });

    return () => {
      socket.off("allWin");
      socket.off("WrongGuessToDisplay");
    };
  }, []);

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
