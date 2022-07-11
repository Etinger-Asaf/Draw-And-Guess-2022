// import { useLocation } from "react-router-dom";
// import { useLayoutEffect, useState, useRef, useEffect } from "react";
// import Canvas from "../reusable/Canvas";

// const Drawing = () => {
//   const location = useLocation();
//   const word = location.state.word[0];
//   const [draw, setDraw] = useState("");
//   const backgroundBoxRef = useRef(null);
//   const [windowWidth, setWindowWidth] = useState();
//   const [canvasDynamicsWidth, setCanvasDynamicsWidth] = useState();
//   const [canvasDynamicsHeight, setCanvasDynamicsHeight] = useState();

//   useEffect(() => {
//     async function postDate() {
//       try {
//         if (draw.length === 0) return;

//         const reqOptions = {
//           method: "POST",
//           headers: { "Content-type": "application/json" },
//           body: JSON.stringify({ word: word, draw: draw }),
//         };

//         await fetch("http://localhost:8000/api/v1/gameData", reqOptions).then(
//           (res) => res.json()
//         );
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     postDate();
//   }, [draw, word]);

//   useLayoutEffect(() => {
//     window.addEventListener("resize", () => {
//       setWindowWidth(window.innerWidth)
//     });
//   });

//   useLayoutEffect(() => {
//     const canvasWidth = backgroundBoxRef.current.offsetWidth * 0.9;
//     const canvasHeight = backgroundBoxRef.current.offsetHeight * 0.7;
//     setCanvasDynamicsWidth(canvasWidth);
//     setCanvasDynamicsHeight(canvasHeight);
//   }, [windowWidth]);

//   return (
//     <div className="backgroundBoxColor" ref={backgroundBoxRef}>
//       <div className="contentAlignmentBox">
//         <h1>Your word to draw is {word}</h1>
//         <Canvas
//           setDraw={setDraw}
//           canvasWidth={canvasDynamicsWidth}
//           canvasHeight={canvasDynamicsHeight}
//         />
//       </div>
//     </div>
//   );
// };

// export default Drawing;
