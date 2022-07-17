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
  let ioURL = "http://localhost:8000";
  if (process.env.NODE_ENV === "production") {
    ioURL = "https://draw-riddle.herokuapp.com";
  }
  const socket = io(ioURL);

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
      e.preventDefault();
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

    // TOUCH DRAWING

    const touchStartHnadler = (e) => {
      console.log("touchStartHnadler", e);
      e.preventDefault();
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

    // Handling mouse move

    const touchMoveHandler = (e) => {
      e.preventDefault();
      console.log(mouseDown);

      if (mouseDown && context) {
        start = {
          x: end.x,
          y: end.y,
        };
        console.log("startMove", start);

        end = {
          x: e.touches[0].clientX - canvasOffsetLeft,
          y: e.touches[0].clientY - canvasOffsetTop,
        };
        console.log("endMove", end);

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = `${color}`;
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
      }
    };

    // Handling mouse up

    const touchEndHnadler = (e) => {
      mouseDown = false;
    };

    if (canvas.current) {
      const renderCtx = canvas.current.getContext("2d");

      if (renderCtx) {
        canvas.current.addEventListener("mousedown", handleMouseDown);
        canvas.current.addEventListener("mouseup", handleMouseUp);
        canvas.current.addEventListener("mousemove", handleMouseMove);

        canvas.current.addEventListener("touchstart", touchStartHnadler);
        canvas.current.addEventListener("touchmove", touchMoveHandler);
        canvas.current.addEventListener("touchend", touchEndHnadler);

        canvasOffsetLeft = canvas.current.offsetLeft;
        canvasOffsetTop = canvas.current.offsetTop;

        setContext(renderCtx);
      }
    }

    return function cleanup() {
      if (canvas.current) {
        // mouse
        canvas.current.removeEventListener("mousedown", handleMouseDown);
        canvas.current.removeEventListener("mouseup", handleMouseUp);
        canvas.current.removeEventListener("mousemove", handleMouseMove);
        // touch
        canvas.current.removeEventListener("touchstart", touchStartHnadler);
        canvas.current.removeEventListener("touchmove", touchMoveHandler);
        canvas.current.removeEventListener("touchend", touchEndHnadler);
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
          className="colorBtn btnRed"
          onClick={() => {
            setColor("#072624");
          }}
        ></button>
        <button
          className="colorBtn btnBlack"
          onClick={() => {
            setColor("#1e9892");
          }}
        ></button>
        <button
          className="colorBtn btnBlue"
          onClick={() => {
            setColor("#51cbc5");
          }}
        ></button>
        <button
          className="colorBtn btnGreen"
          onClick={() => {
            setColor("#a8e5e2");
          }}
        ></button>
        <button
          className="colorBtn btnYellow"
          onClick={() => {
            setColor("#e9f9f8");
          }}
        ></button>
      </div>
      <div className="navigationBtnContainer">
        <button
          className="btn drawBtn clearAndSaveBtns"
          onClick={() => {
            clearCanvasHandler();
          }}
        >
          clear
        </button>
        <button
          className="btn drawBtn clearAndSaveBtns"
          onClick={() => {
            saveCanvasFinalDrawHandler();
          }}
        >
          save
        </button>
        <Link
          className="btn drawBtn canvasBtn playBtn"
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
