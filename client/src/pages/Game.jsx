import { useState } from "react";
import BattleField from "../components/BattleField";
import BombBar from "../components/BombBar";
import Timer from "../components/Timer";

function App() {
  const NO_BOMB_USING = -1
  const TURN_DURATION = 0
  
  const [clickedBomb, setClickedBomb] = useState(0)
  const [bomb, setBomb] = useState([3, 2, 1, 1])

  const handleButtonClick = (value) => {
    setClickedBomb(value);
  };

  const handleBombUsed = (data) => {
    if (bomb[clickedBomb] == 0) {
      setClickedBomb(NO_BOMB_USING)
    }
    
    setBomb((prevBomb) => {
      const updatedBomb = [...prevBomb]
      return updatedBomb
    });
  };

  return (
    <div className="flex flex-col items-center">
      <header className="font-bold text-2xl text-center uppercase mt-4">
        Battle field
      </header>

      <Timer time={TURN_DURATION}/>

      <BombBar onButtonClick={handleButtonClick} bomb={bomb}></BombBar>
      <BattleField
        battleSize={10}
        bomb={bomb}
        bombIsUsing={clickedBomb}
        bombUsed={handleBombUsed}
      ></BattleField>
    </div>
  );
}

export default App;
