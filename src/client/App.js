import "./styles.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

function App() {
  const dispatch = useDispatch();
  let [playerLeftState, setPlayerLeftState] = useState(false);
  let [appBackgroundColor, setAppBackgroundColor] = useState("App");
  let [socketState, setSocketState] = useState(false);
  const navigate = useNavigate();

  // Creating socket and useing redux to golobaly serve it
  let socketIoUrl = "";

  if (process.env.NODE_ENV === "development") {
    socketIoUrl = "http://127.0.0.1:8000";
  }
  if (process.env.NODE_ENV === "production") {
    socketIoUrl = "https://draw-riddle.herokuapp.com";
  }

  useEffect(() => {
    const socketToRedux = io(socketIoUrl, {
      "sync disconnect on unload": true,
    });
    dispatch(setSocket(socketToRedux));
  }, []);

  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    setSocketState(socket);
  }, [socket]);

  const randomIdNum = () => {
    return Math.floor(Math.random() * 1000);
  };
  const playerID = randomIdNum();

  useEffect(() => {
    if (!socketState) return;

    socketState.on("changeAppBackgroundColorRed", () => {
      setAppBackgroundColor("AppRedBackGround");
    });
    socketState.on("changeAppBackgroundColorYellow", () => {
      setAppBackgroundColor("App");
    });

    return () => {
      socketState.off("changeAppBackgroundColorRed");
      socketState.off("changeAppBackgroundColorYellow");
    };
  }, [socketState]);

  useEffect(() => {
    if (!socketState) return;

    socketState.on("displayPlayerLeft", () => {
      console.log("player left 1");
      setPlayerLeftState(true);
    });
    setPlayerLeftState(false);

    return () => {
      socketState.off("displayPlayerLeft");
    };
  }, [socketState]);

  const navigationHndler = () => {
    navigate("/PlayerLeft");
  };

  useEffect(() => {
    if (!playerLeftState) return;
    navigationHndler();
  }, [playerLeftState]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearGameData);

    return () => {
      window.removeEventListener("beforeunload", clearGameData);
    };
  }, [socketState]);

  return (
    <div className={`${appBackgroundColor}`}>
      <Routes>
        <Route path="/" element={<Welcome id={playerID} />} />
        <Route path="/ChooseWord" element={<ChooseWord />} />
        <Route path="/WaitingPlayer1" element={<WaitingPlayer1 />} />
        <Route path="/WaitingPlayer2" element={<WaitingPlayer2 />} />
        <Route path="/NewDrawing" element={<NewDrawing />} />
        <Route path="/NewGuessingCanvas" element={<NewGuessingCanvas />} />
        <Route path="/PlayerLeft" element={<PlayerLeft />} />
      </Routes>
      {/* {playerLeftState && <Navigate replace to="/PlayerLeft" /> } */}
    </div>
  );
}

export default App;
