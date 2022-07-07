import CanvasDraw from "react-canvas-draw";

import { useRef } from "react";

const Canvas = ({ draw, width, height }) => {
  const canvasRef = useRef();

  return (
    <div className="canvasContainer">
      <CanvasDraw
        ref={canvasRef}
        saveData={draw}
        disabled={true}
        canvasWidth={width}
        canvasHeight={height}
        className="canvas"
      />
      <div className="canvasButtons"></div>
    </div>
  );
};

export default Canvas;
