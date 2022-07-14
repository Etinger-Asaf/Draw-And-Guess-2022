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

    // test

    const handleTouchStart = () => {
      const mouseDownEventForTouch = (e) => {
        console.log("handleTouchStart", e);

        mouseDown = true;

        start = {
          x: e.clientX - canvasOffsetLeft,
          y: e.clientY - canvasOffsetTop,
        };

        end = {
          x: e.clientX - canvasOffsetLeft,
          y: e.clientY - canvasOffsetTop,
        };

        canvas.current.removeEventListener("mousedown", mouseDownEventForTouch);
      };

      canvas.current.addEventListener("mousedown", mouseDownEventForTouch);
    };

    const handleTouchUp = () => {
      const mouseUpEventForTouch = (e) => {
        console.log("handleTouchUp", e);
        mouseDown = false;
        canvas.current.removeEventListener("mouseup", mouseUpEventForTouch);
      };
      canvas.current.addEventListener("mouseup", mouseUpEventForTouch);
    };

    const handleTouchMove = () => {
      const mouseMoveEventForTouch = (e) => {
        console.log("handleTouchMove", e);

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
        canvas.current.removeEventListener("mousemove", mouseMoveEventForTouch);
      };
      canvas.current.addEventListener("mousemove", mouseMoveEventForTouch);
    };

    if (canvas.current) {
      const renderCtx = canvas.current.getContext("2d");

      if (renderCtx) {
        canvas.current.addEventListener("mousedown", handleMouseDown);
        canvas.current.addEventListener("touchstart", handleTouchStart);
        canvas.current.addEventListener("mouseup", handleMouseUp);
        canvas.current.addEventListener("touchend", handleTouchUp);
        canvas.current.addEventListener("mousemove", handleMouseMove);
        canvas.current.addEventListener("touchmove", handleTouchMove);

        canvasOffsetLeft = canvas.current.offsetLeft;
        canvasOffsetTop = canvas.current.offsetTop;

        setContext(renderCtx);
      }
    }

    return function cleanup() {
      if (canvas.current) {
        canvas.current.removeEventListener("mousedown", handleMouseDown);
        canvas.current.removeEventListener("touchstart", handleTouchStart);

        canvas.current.removeEventListener("mouseup", handleMouseUp);
        canvas.current.removeEventListener("touchend", handleTouchUp);

        canvas.current.removeEventListener("mousemove", handleMouseMove);
        canvas.current.removeEventListener("touchmove", handleTouchMove);
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
          className="btn clearAndSaveBtns"
          onClick={() => {
            clearCanvasHandler();
          }}
        >
          clear
        </button>
        <button
          className="btn clearAndSaveBtns"
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
