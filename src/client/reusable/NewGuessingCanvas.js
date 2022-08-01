import { useRef, useLayoutEffect, useState, useEffect } from "react";
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

  let fetchURL = "http://localhost:8000/api/v1/gameData";
  if (process.env.NODE_ENV === "production") {
    fetchURL = "/api/v1/gameData";
  }

  const { socket } = useSelector((state) => state.socket);

  const { word, draw } = useSelector((state) => state.gameData);

  const trimAndLowerWord = word.toLowerCase().trim();
  const trimAndLowerInputWord = inputWord.toLowerCase().trim();

  
  const guessBtnHndler = () => {
    let res = /^[a-zA-Z]+$/.test(inputWord);
    console.log('res', res)

    if (!res) {
      alert('Opps! Guesses can only by in English!')
    }

  }

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
      await fetch(fetchURL, reqOptionsDelete);
    }
    GameData();
  }, [win, fetchURL]);

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
    const canvasHeight = canvasWidth / 3;

    setCanvasDynamicsWidth(canvasWidth);
    setCanvasDynamicsHeight(canvasHeight);
  }, [windowWidth]);

  useEffect(() => {
    if (
      draw.length === 0 ||
      canvasDynamicsWidth === undefined ||
      canvasDynamicsHeight === undefined
    )
      return;
    

    const canvasCtx = canvas.current.getContext("2d");
    let img = new Image();
    img.onload = () => {
      canvasCtx.drawImage(img, 0, 0, canvasDynamicsWidth, canvasDynamicsHeight);
    };

    img.src = draw;
  }, [draw, canvasDynamicsWidth, canvasDynamicsHeight]);

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
        <button className="btn" onClick={() => {guessBtnHndler()}}>Guess</button>
      </form>

      <div className="popup">
        <WinningPopup whereTo="/ChooseWord" isOpen={win} />
      </div>
    </div>
  );
};

export default NewGuessingCanvas;
