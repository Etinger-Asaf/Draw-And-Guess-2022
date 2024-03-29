import { Navigate } from "react-router-dom";
import { useState } from "react";
import ReactDOM from "react-dom";

const WinningPopup = ({ whereTo, isOpen }) => {
  const [anotherGame, setAnotherGame] = useState(false);

  const portalDestination = document.getElementById("overlay");

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="portalDisplayControl">
      <div className="portalContainer">
        <h1 className="portalText">You win!</h1>
        <p className="portalText portalTextP">
          Would you like to play another game?
        </p>
        <button
          className="btn portalBtn"
          onClick={() => {
            setAnotherGame(true);
          }}
        >
          Play!
        </button>
        {anotherGame && <Navigate replace to={whereTo} />}
      </div>
    </div>,
    portalDestination
  );
};

export default WinningPopup;
