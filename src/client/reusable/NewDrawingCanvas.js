import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

let coordinates = {
  x: 0,
  y: 0,
};

const DrawingCanvas = ({ width, height, setDraw }) => {
  const canvas = useRef();
  const [context, setContext] = useState();
  const [color, setColor] = useState("#080808");
  const socket = io("http://localhost:8000");

  const clearCanvasHandler = () => {
    if (!canvas.current) return;
    const canvasCtx = canvas.current.getContext("2d");
    if (canvasCtx) {
      canvasCtx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    }
  };

  const saveCanvasFinalDrawHandler = () => {
    if (!canvas.current) return;
    const canvasCtx = canvas.current.getContext("2d");
    if (canvasCtx) {
      const dataURL = canvas.current.toDataURL();
      setDraw(dataURL);
    }
  };

  useEffect(() => {
    let mouseDown = false;
    let start = coordinates;
    let end = coordinates;
    let canvasOffsetLeft = 0;
    let canvasOffsetTop = 0;

    const handleMouseDown = (e) => {
      mouseDown = true;

      start = {
        x: e.clientX - canvasOffsetLeft,
        y: e.clientY - canvasOffsetTop,
      };

      end = {
        x: e.clientX - canvasOffsetLeft,
        y: e.clientY - canvasOffsetTop,
      };
    };
    const handleMouseUp = (e) => {
      mouseDown = false;
    };
    const handleMouseMove = (e) => {
      if (mouseDown && context) {
        start = {
          x: end.x,
          y: end.y,
        };

        end = {
          x: e.clientX - canvasOffsetLeft,
          y: e.clientY - canvasOffsetTop,
        };

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = `${color}`;
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
      }
    };

    if (canvas.current) {
      const renderCtx = canvas.current.getContext("2d");

      if (renderCtx) {
        canvas.current.addEventListener("mousedown", handleMouseDown);
        canvas.current.addEventListener("mouseup", handleMouseUp);
        canvas.current.addEventListener("mousemove", handleMouseMove);

        canvasOffsetLeft = canvas.current.offsetLeft;
        canvasOffsetTop = canvas.current.offsetTop;

        setContext(renderCtx);
      }
    }

    return function cleanup() {
      if (canvas.current) {
        canvas.current.removeEventListener("mousedown", handleMouseDown);
        canvas.current.removeEventListener("mouseup", handleMouseUp);
        canvas.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [context, color]);

  return (
    <div>
      <div>
        <canvas
          id="myCanvas"
          width={width}
          height={height}
          ref={canvas}
        ></canvas>
      </div>
      <div className="colorSelectionBtnContainer">
        <button
          className="colorBtn btnBlack"
          onClick={() => {
            setColor("#080808");
          }}
        ></button>
        <button
          className="colorBtn btnRed"
          onClick={() => {
            setColor("#f70202");
          }}
        ></button>
        <button
          className="colorBtn btnYellow"
          onClick={() => {
            setColor("#f7ef02");
          }}
        ></button>
        <button
          className="colorBtn btnBlue"
          onClick={() => {
            setColor("#0213f7");
          }}
        ></button>
        <button
          className="colorBtn btnGreen"
          onClick={() => {
            setColor("#0bf702");
          }}
        ></button>
      </div>
      <div className="navigationBtnContainer">
        <button
          className="btn"
          onClick={() => {
            clearCanvasHandler();
          }}
        >
          clear
        </button>
        <button
          className="btn"
          onClick={() => {
            saveCanvasFinalDrawHandler();
          }}
        >
          save
        </button>
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

export default DrawingCanvas;
