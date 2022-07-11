// import GuessingCanvas from "../reusable/GuessingCanvas";
// import { useSelector } from "react-redux";
// import { useState, useRef, useLayoutEffect } from "react";
// import WinningPopup from "./../reusable/WinningPopup";
// import { useEffect } from "react";
// import { io } from "socket.io-client";
// // import ReactDOM from "react-dom";

// const Guessing = () => {
//   const [inputWord, setInputWord] = useState("");
//   const [win, setIsWin] = useState(false);
//   const [numGuess, setNumGuess] = useState(0);
//   const socket = io("http://localhost:8000");
//   const backgroundBoxRef = useRef(null);
//   const [windowWidth, setWindowWidth] = useState();
//   const [canvasDynamicsWidth, setCanvasDynamicsWidth] = useState();
//   const [canvasDynamicsHeight, setCanvasDynamicsHeight] = useState();

//   const { word, draw } = useSelector((state) => state.gameData);

//   const trimAndLowerWord = word.toLowerCase().trim();
//   const trimAndLowerInputWord = inputWord.toLowerCase().trim();

//   // const portalDestination = document.getElementById("overlay");

//   const formHandler = (e) => {
//     e.preventDefault();

//     if (trimAndLowerWord === trimAndLowerInputWord) {
//       setIsWin(true);
//       socket.emit("win");
//     } else {
//       setNumGuess(numGuess + 1);
//       socket.emit("wrongGuess", trimAndLowerInputWord);
//     }

//     setInputWord("");
//   };

//   useEffect(() => {
//     async function GameData() {
//       if (!win) {
//         return;
//       }

//       const reqOptionsDelete = {
//         method: "DELETE",
//         headers: { "Content-type": "application/json" },
//       };
//       await fetch("http://localhost:8000/api/v1/gameData", reqOptionsDelete);
//     }
//     GameData();
//   }, [win]);

//   useEffect(() => {
//     if (numGuess === 0) {
//       return;
//     }
//     socket.emit("backgroundColorChangeRed");

//     const backGroundChangeTimer = setTimeout(() => {
//       socket.emit("backgroundColorChangeYellow");
//     }, 170);

//     return () => {
//       clearTimeout(backGroundChangeTimer);
//     };
//   }, [numGuess]);

//   useLayoutEffect(() => {
//     window.addEventListener("resize", () => {
//       setWindowWidth(window.innerWidth);
//     });
//   });

//   useLayoutEffect(() => {
//     const canvasWidth = backgroundBoxRef.current.offsetWidth * 0.9;
//     const canvasHeight = backgroundBoxRef.current.offsetHeight * 0.7;
//     setCanvasDynamicsWidth(canvasWidth);
//     setCanvasDynamicsHeight(canvasHeight);
//   }, [windowWidth]);

//   return (
//     <div className="backgroundBoxColor guessing" ref={backgroundBoxRef}>
//       <h1>Guessing</h1>
//       <h3>Number of guesses {numGuess}</h3>
//       <GuessingCanvas
//         draw={draw}
//         width={canvasDynamicsWidth}
//         height={canvasDynamicsHeight}
//       />
//       <form onSubmit={formHandler} className="guessingForm">
//         <input
//           className="input"
//           placeholder="Type Here!"
//           value={inputWord}
//           onChange={(e) => {
//             setInputWord(e.target.value);
//           }}
//         ></input>
//         <button className="btn">Guess</button>
//       </form>
//       <div className="popup">
//         <WinningPopup whereTo="/ChooseWord" isOpen={win} />
//       </div>
//     </div>
//   );
// };

// export default Guessing;
