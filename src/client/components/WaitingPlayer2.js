import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDraw, updateWord } from "../redux/slices/gameDataSlice";
import { io } from "socket.io-client";
const WaitingPlayer2 = () => {
  const dispatch = useDispatch();

  const [game, setGame] = useState(false);
  const [httpCounter, setHttpCounter] = useState(0);
  const [word, setWord] = useState("");
  const [draw, setDraw] = useState("");

  const socket = io("http://localhost:8000");

  socket.on("connect", () => {
    
  });

  socket.on("newPolling", () => {
   
    setHttpCounter(httpCounter + 1);
  });

  useEffect(() => {
    async function getGame() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/gameData");

        if (!res) {
          return;
        }

        const data = await res.json();

        if (!data) {
          return;
        }

       
        if (word.length === 0 && draw.length === 0) {
          setWord(data.body.data.word);
          setDraw(data.body.data.draw);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getGame();
  }, [httpCounter]);

  useEffect(() => {
    if (word.length === 0 || draw.length === 0) {
      return;
    }
    dispatch(updateWord(word));
    dispatch(updateDraw(draw));
    setGame(true);
  }, [word, draw, dispatch]);

  return (
    <div className="backgroundBoxColor">
      <h1>Waiting player 2</h1>
      <p>Waiting is a bummer, but that is part of the game..</p>
      {game && <Navigate replace to="/Guessing" />}
    </div>
  );
};

export default WaitingPlayer2;
