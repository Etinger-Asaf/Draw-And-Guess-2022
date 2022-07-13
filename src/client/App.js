import "./styles.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { clearGameData } from "./helperFunctions/ClearGameData";
import Welcome from "./components/Welcome";
import ChooseWord from "./components/ChooseWord";
import WaitingPlayer1 from "./components/WaitingPlayer1";
import WaitingPlayer2 from "./components/WaitingPlayer2";
import PlayerLeft from "./components/PlayerLeft";
import NewDrawing from "./components/NewDrawing";
import NewGuessingCanvas from "./reusable/NewGuessingCanvas";
// Testing

function App() {
  let [playerLeft, setPlayerLeft] = useState(0);
  let [appBackgroundColor, setAppBackgroundColor] = useState("App");

  const randomIdNum = () => {
    return Math.floor(Math.random() * 1000);
  };
  const playerID = randomIdNum();

  let sokectIoPort = "";
  if (process.env.NODE_ENV === "development") {
    sokectIoPort = "http://127.0.0.1:8000";
    console.log("dev", process.env.REACT_APP_ENVIRONMENT);
    console.log("dev", process.env.NODE_ENV);
  }
  if (process.env.NODE_ENV === "production") {
    console.log("prod", process.env.REACT_APP_ENVIRONMENT);
    console.log("prod", process.env.NODE_ENV);
    sokectIoPort = "";
  }

  useEffect(() => {
    const socket = io(sokectIoPort);
    socket.on("connect", () => {});

    socket.on("displayPlayerLeft", () => {
      setPlayerLeft(playerLeft++);
      console.log("The other player has left event Front");
    });

    socket.on("changeAppBackgroundColorRed", () => {
      setAppBackgroundColor("AppRedBackGround");
    });
    socket.on("changeAppBackgroundColorYellow", () => {
      setAppBackgroundColor("App");
    });
  }, [playerLeft]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearGameData);

    return () => {
      window.removeEventListener("beforeunload", clearGameData);
    };
  });

  return (
    <div className={appBackgroundColor}>
      <Routes>
        <Route path="/" element={<Welcome id={playerID} />} />
        <Route path="/ChooseWord" element={<ChooseWord />} />
        <Route path="/WaitingPlayer1" element={<WaitingPlayer1 />} />
        <Route path="/WaitingPlayer2" element={<WaitingPlayer2 />} />
        {/* <Route path="/Drawing" element={<Drawing />} /> */}
        <Route path="/NewDrawing" element={<NewDrawing />} />
        <Route path="/NewGuessingCanvas" element={<NewGuessingCanvas />} />
        <Route path="/PlayerLeft" element={<PlayerLeft />} />
      </Routes>
      {playerLeft === 1 && <Navigate replace to="/PlayerLeft" />}
    </div>
  );
}

export default App;
