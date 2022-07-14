import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const IsPlayerConnected = ({ statusRec }) => {
  const [connectedPlayer2, setConnectedPlayer2] = useState("not connected");

  let ioURL = "http://localhost:8000";
  if (process.env.NODE_ENV === "production") {
    ioURL = "https://draw-riddle.herokuapp.com";
  }
  const socket = io(ioURL);

  useEffect(() => {
    if (statusRec > 0) {
      setConnectedPlayer2("connected");
    }
  }, [statusRec]);

  socket.on("displayPlayer2Joined", () => {
    setConnectedPlayer2("connected");
  });

  return (
    <div className="isPlayerConnectedDisplay">
      <div>
        <h2 key={statusRec} className="playerIsConnected">
          Player 1 is connected
        </h2>
        <h2
          className={
            connectedPlayer2 === "connected"
              ? "playerIsConnected"
              : "playerIsNotConnected"
          }
        >
          Player 2 is {connectedPlayer2}
        </h2>
      </div>
    </div>
  );
};

export default IsPlayerConnected;
