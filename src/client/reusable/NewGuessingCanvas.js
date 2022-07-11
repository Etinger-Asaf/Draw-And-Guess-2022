import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import WinningPopup from "./WinningPopup";

const NewGuessingCanvas = () => {
  const canvas = useRef();
  const [inputWord, setInputWord] = useState("");
  const [win, setIsWin] = useState(false);
  const [numGuess, setNumGuess] = useState(0);
  const [canvasDynamicsWidth, setCanvasDynamicsWidth] = useState();
  const [canvasDynamicsHeight, setCanvasDynamicsHeight] = useState();
  const [windowWidth, setWindowWidth] = useState();
  const socket = io("http://localhost:8000");

  const { word, draw } = useSelector((state) => state.gameData);

  const trimAndLowerWord = word.toLowerCase().trim();
  const trimAndLowerInputWord = inputWord.toLowerCase().trim();

  const formHandler = (e) => {
    e.preventDefault();

    if (trimAndLowerWord === trimAndLowerInputWord) {
      setIsWin(true);
      socket.emit("win");
    } else {
      setNumGuess(numGuess + 1);
      socket.emit("wrongGuess", trimAndLowerInputWord);
    }

    setInputWord("");
  };

  useEffect(() => {
    async function GameData() {
      if (!win) {
        return;
      }

      const reqOptionsDelete = {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      };
      await fetch("http://localhost:8000/api/v1/gameData", reqOptionsDelete);
    }
    GameData();
  }, [win]);

  useEffect(() => {
    if (numGuess === 0) {
      return;
    }
    socket.emit("backgroundColorChangeRed");

    const backGroundChangeTimer = setTimeout(() => {
      socket.emit("backgroundColorChangeYellow");
    }, 170);

    return () => {
      clearTimeout(backGroundChangeTimer);
    };
  }, [numGuess]);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  });

  useLayoutEffect(() => {
    const canvasWidth = window.innerWidth * 0.9;
    const canvasHeight = window.innerHeight * 0.7;
    setCanvasDynamicsWidth(canvasWidth);
    setCanvasDynamicsHeight(canvasHeight);
  }, [windowWidth]);

  useEffect(() => {
    if (draw.length === 0) return;

    const canvasCtx = canvas.current.getContext("2d");
    let img = new Image();
    img.onload = () => {
      canvasCtx.drawImage(img, 0, 0);
    };
    img.src = draw;
  }, [draw]);

  return (
    <div className="backgroundBoxColor guessing">
      <h1>Guessing</h1>
      <h3>Number of guesses {numGuess}</h3>
      <div>
        <canvas
          id="myCanvas"
          width={canvasDynamicsWidth}
          height={canvasDynamicsHeight}
          ref={canvas}
        ></canvas>
      </div>
      <form onSubmit={formHandler} className="guessingForm">
        <input
          className="input"
          placeholder="Type Here!"
          value={inputWord}
          onChange={(e) => {
            setInputWord(e.target.value);
          }}
        ></input>
        <button className="btn">Guess</button>
      </form>
      <div className="popup">
        <WinningPopup whereTo="/ChooseWord" isOpen={win} />
      </div>
    </div>
  );
};

export default NewGuessingCanvas;
