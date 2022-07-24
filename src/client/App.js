import "./styles.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { clearGameData } from "./helperFunctions/ClearGameData";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/slices/socketIoSlice";
import Welcome from "./components/Welcome";
import ChooseWord from "./components/ChooseWord";
import WaitingPlayer1 from "./components/WaitingPlayer1";
import WaitingPlayer2 from "./components/WaitingPlayer2";
import PlayerLeft from "./components/PlayerLeft";
import NewDrawing from "./components/NewDrawing";
import NewGuessingCanvas from "./reusable/NewGuessingCanvas";
// Testing

function App() {
  const dispatch = useDispatch();
  let [playerLeft, setPlayerLeft] = useState(0);
  let [appBackgroundColor, setAppBackgroundColor] = useState("App");

  // Creating socket and useing redux to golobaly serve it
  let socketIoUrl = "";

  if (process.env.NODE_ENV === "development") {
    socketIoUrl = "http://127.0.0.1:8000";
  }
  if (process.env.NODE_ENV === "production") {
    socketIoUrl = "https://draw-riddle.herokuapp.com";
  }

  console.log(socketIoUrl);
  const socket = io(socketIoUrl);
  console.log("socket from App", socket);
  dispatch(setSocket(socket));

  // const { socket } = useSelector((state) => state.socket);
  // console.log(socket);

  const randomIdNum = () => {
    return Math.floor(Math.random() * 1000);
  };
  const playerID = randomIdNum();

  useEffect(() => {
    socket.emit("Just something to test the server");
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

    return () => {
      socket.off("displayPlayerLeft");
      socket.off("changeAppBackgroundColorRed");
      socket.off("changeAppBackgroundColorYellow");
    };
  }, [playerLeft]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearGameData);

    return () => {
      window.removeEventListener("beforeunload", clearGameData);
    };
  });

  return (
    <div className={`${appBackgroundColor} app`}>
      <Routes>
        <Route path="/" element={<Welcome id={playerID} />} />
        <Route path="/ChooseWord" element={<ChooseWord />} />
        <Route path="/WaitingPlayer1" element={<WaitingPlayer1 />} />
        <Route path="/WaitingPlayer2" element={<WaitingPlayer2 />} />
        <Route path="/NewDrawing" element={<NewDrawing />} />
        <Route path="/NewGuessingCanvas" element={<NewGuessingCanvas />} />
        <Route path="/PlayerLeft" element={<PlayerLeft />} />
      </Routes>
      {playerLeft === 1 && <Navigate replace to="/PlayerLeft" />}
    </div>
  );
}

export default App;
