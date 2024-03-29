import randomWords from "random-words";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ChooseWord = () => {
  const [wordEasy, setWordEasy] = useState("");
  const [wordMedium, setWordMedium] = useState("");
  const [wordHard, setWordHard] = useState("");

  let ioURL = "http://127.0.0.1:8000";
  if (process.env.NODE_ENV === "production") {
    ioURL = "https://draw-riddle.herokuapp.com";
  }
  
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    const easyRandomWord = randomWords({ maxLength: 4, exactly: 1 });
    const mediumRandomWord = randomWords({ maxLength: 5, exactly: 1 });
    const hardRandomWord = randomWords({ maxLength: 10, exactly: 1 });

    setWordEasy(easyRandomWord);
    setWordMedium(mediumRandomWord);
    setWordHard(hardRandomWord);
  }, []);
  

  return (
    <div className="backgroundBoxColor">
      <h1>ChooseWord</h1>
      <div className="chooseWordBtnContainer">
        <Link
          className="btn"
          to={"/NewDrawing"}
          state={{ word: wordEasy }}
          value={wordEasy}
        >
          {wordEasy}
        </Link>

        <Link
          className="btn"
          to={"/NewDrawing"}
          state={{ word: wordMedium }}
          value={wordMedium}
        >
          {wordMedium}
        </Link>

        <Link
          className="btn"
          to={"/NewDrawing"}
          state={{ word: wordHard }}
          value={wordHard}
        >
          {wordHard}
        </Link>
      </div>
    </div>
  );
};

export default ChooseWord;
