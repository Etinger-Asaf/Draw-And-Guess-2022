import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const IsPlayerConnected = ({ statusRec }) => {
  const [connectedPlayer2, setConnectedPlayer2] = useState("not connected");
  const [socketState, setSocketState] = useState(false);
  
  // let ioURL = "http://localhost:8000";

  // if (process.env.NODE_ENV === "production") {
  //   ioURL = "https://draw-riddle.herokuapp.com";
  // }

  useEffect(() => {
    console.log(statusRec)
    if (statusRec > 0) {
      setConnectedPlayer2("connected");
    }
  }, [statusRec]);

  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    if (!socket) return
    setSocketState(socket)
  }, [socket])


  useEffect(() => {
    
    if (!socketState) return;
    

    socketState.on("displayPlayer2Joined", () => {
      setConnectedPlayer2("connected");
    });

    return () => {
      socketState.off("displayPlayer2Joined");
    };
  }, [socketState]);

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
