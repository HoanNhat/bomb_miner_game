import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BattleField from "../components/BattleField";
import BombBar from "../components/BombBar";
import Timer from "../components/Timer";
import RoomContext from "../context/RoomContext";

function App() {
  const NO_BOMB_USING = -1;
  const TURN_DURATION = 0;

  const navigate = useNavigate();
  const { setRoomId } = useContext(RoomContext);
  const [bomb, setBomb] = useState([2, 2, 1, 1]);
  const [clickedBomb, setClickedBomb] = useState(0);

  const handleButtonClick = (value) => {
    setClickedBomb(value);
  };

  const handleBombUsed = (data) => {
    if (bomb[clickedBomb] == 0) {
      setClickedBomb(NO_BOMB_USING);
    }

    setBomb((prevBomb) => {
      const updatedBomb = [...prevBomb];
      return updatedBomb;
    });
  };

  const handleLeaveRoom = () => {
    localStorage.clear();
    setRoomId(null);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center">
      <header className="font-bold text-2xl text-center uppercase mt-4">
        Battle field
      </header>
      <button
        type="button"
        className="mt-4 text-white bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        onClick={handleLeaveRoom}
      >
        Leave room
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>

      <Timer time={TURN_DURATION} />

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
