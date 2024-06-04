import React, { useState } from "react";
import Bomb from "./Bomb";

const BombBar = ({ onButtonClick, bomb }) => {
  const [isClicked, setIsClicked] = useState();

  const handleClick = (event) => {
    const bombIsChoosing = parseInt(event.target.value);

    if (isClicked == bombIsChoosing || bomb[bombIsChoosing] == 0) {
      setIsClicked(-1);
      onButtonClick(-1);
    } else {
      setIsClicked(bombIsChoosing);
      onButtonClick(bombIsChoosing);
    }
  };

  return (
    <div className="center mt-2 grid h-36 w-1/2 grid-cols-2 gap-2">
      {bomb.map((bombNumber, bomb) => (
        <button
          key={bomb}
          value={bomb}
          onClick={handleClick}
          className={`place-self-center w-full h-full bg-slate-300 ${
            isClicked == bomb ? "bg-slate-100" : ""
          } ${bombNumber == 0 ? "bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" : ""} hover:bg-slate-200`}
          disabled={bombNumber == 0}
        >
          {bomb + 1} x {bombNumber}
          {/* <Bomb number={num}></Bomb> */}
        </button>
      ))}
    </div>
  );
};

export default BombBar;
