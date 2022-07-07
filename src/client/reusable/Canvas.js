import CanvasDraw from "react-canvas-draw";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

import { useRef } from "react";

const Canvas = ({ setDraw, canvasWidth, canvasHeight }) => {
  const canvasRef = useRef();
  const socket = io("http://localhost:8000");

  const clear = () => canvasRef.current.clear();

  const save = () => {
    setDraw(canvasRef.current.getSaveData());
  };

  return (
    <div className="canvasContainer">
      <CanvasDraw
        brushRadius={6}
        ref={canvasRef}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        className="canvas"
      />
      <div className="canvasDrawBtnContainer">
        <div className="ClearAndSaveBtnContainer">
          <button className="btn canvasBtn" onClick={clear}>
            Clear
          </button>
          <button className="btn canvasBtn" onClick={save}>
            Save
          </button>
        </div>
        <Link
          className="btn canvasBtn playBtn"
          to="/WaitingPlayer1"
          onClick={() => {
            socket.emit("newDraw");
          }}
        >
          Play
        </Link>
      </div>
    </div>
  );
};

export default Canvas;
