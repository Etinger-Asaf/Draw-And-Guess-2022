import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearGameData } from "../helperFunctions/ClearGameData";

const PlayerLeft = () => {
  const [anotherGame, setAnotherGame] = useState(false);

  useEffect(() => {
    clearGameData();
  });

  return (
    <div className="backgroundBoxColor">
      <h1>Looks like the other player is gone</h1>
      <h3>Probably was losing..</h3>
      <h3>Would you like to wait for another player to join?</h3>
      <button
        className="btn"
        onClick={() => {
          setAnotherGame(true);
        }}
      >
        Yes!
      </button>
      <p>If not, please close the tab.</p>
      {anotherGame && <Navigate replace to="/" />}
    </div>
  );
};

export default PlayerLeft;
