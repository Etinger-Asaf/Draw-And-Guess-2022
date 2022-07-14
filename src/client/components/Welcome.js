import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import IsPlayerConnected from "../reusable/IsPlayerConnected";
import ThereAre2Players from "./ThereAre2Players";
import dotenv from "dotenv";
import "../styles.css";

dotenv.config({ path: "./../../server/config.env" });

const Welcome = ({ id }) => {
  const [activeUsersNum, setActiveUsersNum] = useState(0);
  const [isThere2Players, setIsThere2Players] = useState(false);

  let ioURL = "http://localhost:8000";
  let fetchURL = "http://localhost:8000/api/v1";

  console.log(process.env.NODE_ENV);
  console.log(process.env.REACT_APP_ENVIRONMENT);
  console.log(process.env.PORT);
  if (process.env.NODE_ENV === "production") {
    ioURL = window.location;
    fetchURL = `/api/v1`;
  }

  const socket = io(ioURL);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(fetchURL);
        console.log("res", res);
        const { data } = await res.json();
        console.log("data", data);

        setActiveUsersNum(data.activeUsers);

        const reqOptions = {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ playerID: id }),
        };

        await fetch(fetchURL, reqOptions).then((res) => res.json());
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  let path;
  if (activeUsersNum === 0) {
    path = "/ChooseWord";
  } else if (activeUsersNum === 1) {
    path = "/WaitingPlayer2";
    socket.emit("player2IsJoined");
  }

  socket.on("displayPlayer2Joined", () => {
    setIsThere2Players(true);
  });

  return (
    <div className="backgroundBoxColor">
      {activeUsersNum <= 1 ? (
        <>
          {" "}
          <h1>Draw and Guess</h1>
          <IsPlayerConnected statusRec={activeUsersNum} />
          {!isThere2Players && <p>Waiting for another player..</p>}
          {isThere2Players && (
            <Link to={path} className="btn welcomeBtn">
              PLAY
            </Link>
          )}
        </>
      ) : (
        <ThereAre2Players />
      )}
    </div>
  );
};

export default Welcome;
