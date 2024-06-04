import React from "react";

const Bomb = ({ number }) => {
  const bomb = [];
  for (let i = 0; i < number; i++) {
    bomb.push(`${i}`);
  }

  return (
    <>
      <div className="h-12 w-fit grid grid-flow-col"> 
        {bomb.map((index) => (
          <label>{index}</label>
          // <img className="h-12 w-12" src='https://cdn-icons-png.flaticon.com/512/2144/2144753.png' key={index}/>
        ))}
      </div>
    </>
  );
};

export default Bomb;
