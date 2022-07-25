import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDraw, updateWord } from "../redux/slices/gameDataSlice";
import { useSelector } from "react-redux";
const WaitingPlayer2 = () => {
  const dispatch = useDispatch();

  const [game, setGame] = useState(false);
  const [httpCounter, setHttpCounter] = useState(0);
  const [word, setWord] = useState("");
  const [draw, setDraw] = useState("");

  let ioURL = "http://localhost:8000";
  let fetchURL = "http://localhost:8000/api/v1/gameData";
  if (process.env.NODE_ENV === "production") {
    ioURL = "https://draw-riddle.herokuapp.com";
    fetchURL = "/api/v1/gameData";
  }

  // const socket = io(ioURL);
  const { socket } = useSelector((state) => state.socket);
  

  useEffect(() => {
    socket.on("newPolling", () => {
      
      setHttpCounter(httpCounter + 1);
    });

    return () => {
      socket.off("newPolling");
    };
  }, []);



  useEffect(() => {
    if (httpCounter === 0) return;

    async function getGame() {
      try {
        
        const res = await fetch(fetchURL);

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
    if (word.length === 0 || draw.length === 0) return;
    dispatch(updateWord(word));
    dispatch(updateDraw(draw));
    setGame(true);
  }, [word, draw, dispatch]);

  return (
    <div className="backgroundBoxColor">
      <h1>Waiting player 2</h1>
      <p>Waiting is a bummer, but that is part of the game..</p>
      {game && <Navigate replace to="/NewGuessingCanvas" />}
    </div>
  );
};

export default WaitingPlayer2;
