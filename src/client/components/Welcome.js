import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import IsPlayerConnected from "../reusable/IsPlayerConnected";
import ThereAre2Players from "./ThereAre2Players";
// import dotenv from "dotenv";
import "../styles.css";

// dotenv.config({ path: "./../../server/config.env" });

const Welcome = ({ id }) => {
  const [activeUsersNum, setActiveUsersNum] = useState(0);
  const [isThere2Players, setIsThere2Players] = useState(false);

  let ioURL = "http://localhost:8000";
  let fetchURL = "http://localhost:8000/api/v1";

  if (process.env.NODE_ENV === "production") {
    ioURL = "https://draw-riddle.herokuapp.com";
    fetchURL = `/api/v1`;
  }

  const socket = io(ioURL);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(fetchURL);

        const { data } = await res.json();

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

  let path = "/ChooseWord";

  useEffect(() => {
    if (activeUsersNum === 0) return;

    socket.emit("player2IsJoined");
    path = "/WaitingPlayer2";
  }, [activeUsersNum]);

  useEffect(() => {
    socket.on("displayPlayer2Joined", () => {
      setIsThere2Players(true);
    });

    return () => {
      socket.off("displayPlayer2Joined");
    };
  }, []);

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
