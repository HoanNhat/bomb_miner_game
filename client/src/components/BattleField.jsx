import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import CheckBomb from "../utils/CheckBomb";
import RoomContext from "../context/RoomContext";
import Modal from "./Modal";
import React, { useState, useEffect, useContext } from "react";

const socket = io("http://localhost:3001");

const BattleField = ({ battleSize, bomb, bombIsUsing, bombUsed }) => {
  const battleField = [];

  const CONTINUE = true;
  const NO_BOMB_USING = -1;
  const MATCH_START = true;
  const MATCH_END = true;
  const VERTICAL_DIRECTION = true;

  const navigate = useNavigate();
  const { roomId } = useContext(RoomContext);
  const [isMatchStart, setIsMatchStart] = useState(!MATCH_START);
  const [isMatchEnd, setIsMatchEnd] = useState(!MATCH_START);
  const [isContinueTurn, setIsContinueTurn] = useState(CONTINUE);
  const [bombDirection, setBombDirection] = useState(VERTICAL_DIRECTION);

  const [bombRemoved, setBombRemoved] = useState(1);
  const [bombNeedRemoved, setBombNeedRemoved] = useState(0);
  const [modalMessage, setModalMessage] = useState("Waiting for opponents...");
  const [fieldPlace, setFieldPlace] = useState([]);
  const [bombPosition, setBombPosition] = useState([]);
  const [bombPositionOpponent, setBombPositionOpponent] = useState([]);

  for (let i = 0; i < battleSize; i++) {
    const row = [];
    for (let j = 0; j < battleSize; j++) {
      row.push({ i, j });
    }
    battleField.push(row);
  }

  useEffect(() => {
    const curRoom = localStorage.getItem("currentRoom");
    if (roomId == null && curRoom == null) {
      navigate("/");
    } else {
      socket.emit("join_room", roomId ? roomId : curRoom);

      let sum = 0;
      for (let i = 0; i < bomb.length; i++) {
        sum += bomb[i] * (i + 1);
      }
      setBombNeedRemoved(sum);
    }
  }, []);

  useEffect(() => {
    const handleSendData = (data) => {
      localStorage.setItem("bombPositionOpponent", JSON.stringify(data));
    };

    socket.on("send_data", handleSendData);

    return () => {
      socket.off("send_data", handleSendData);
    };
  }, []);

  useEffect(() => {
    socket.on("player_turn", () => {
      setIsContinueTurn(CONTINUE);
    });

    return () => {
      socket.off("player_turn");
    };
  });

  useEffect(() => {
    socket.on("match_start", () => {
      setBombPosition([]);
      setFieldPlace([]);
      setBombPositionOpponent(
        JSON.parse(localStorage.getItem("bombPositionOpponent"))
      );
      setModalMessage("Match start");
      setTimeout(() => {
        
      }, 3000);
      setIsContinueTurn(CONTINUE);
      setIsMatchStart(MATCH_START);
      setModalMessage("Waiting for opponent...");
    });

    return () => {
      socket.off("match_start");
    };
  }, []);

  useEffect(() => {
    socket.on("winner", (winner) => {
      setIsContinueTurn(!CONTINUE);
      setIsMatchEnd(MATCH_END);

      if (winner == socket.id) {
        console.log("you win");
        setModalMessage("You win");
      } else {
        console.log("you loose");
        setModalMessage("You loose");
      }
    });

    return () => {
      socket.off("winner");
    };
  }, []);

  const handleMouseMove = (position) => {
    let start = { i: position.i, j: position.j };
    let range =
      bombDirection == !VERTICAL_DIRECTION
        ? parseInt(start.j) + bombIsUsing + 1
        : parseInt(start.i) + bombIsUsing + 1;
    let field = [battleField[start.i][start.j]];

    if (range > 10 || bombIsUsing == NO_BOMB_USING) {
      return;
    } else {
      if (bombDirection == !VERTICAL_DIRECTION) {
        for (let i = 1; i <= bombIsUsing; i++) {
          const fieldFollow = battleField[start.i][start.j + i];
          field.push(fieldFollow);
        }
      } else {
        for (let i = 1; i <= bombIsUsing; i++) {
          const fieldFollow = battleField[start.i + i][start.j];
          field.push(fieldFollow);
        }
      }
    }

    setFieldPlace(field);
  };

  const handleMouseLeave = () => {
    setFieldPlace([]);
  };

  const handleDirection = () => {
    setBombDirection(!bombDirection);
  };

  const handleClick = (position) => {
    if (bombIsUsing != NO_BOMB_USING && !isMatchStart) {
      setBombPosition((prev) => [...prev, fieldPlace]);
      bomb[bombIsUsing] -= 1;
      bombUsed(bomb);
    } else if (CheckBomb(position, bombPositionOpponent)) {
      const element = document.getElementById(JSON.stringify(position));
      element.classList.toggle("bg-red-300");

      setBombRemoved((prevBombRemoved) => prevBombRemoved + 1);

      if (bombRemoved == bombNeedRemoved) {
        socket.emit("match_win", [socket.id, roomId]);
      }
    } else if (!CheckBomb(position, bombPositionOpponent)) {
      setIsContinueTurn(!CONTINUE);
      socket.emit("opponent_turn", roomId);
      return;
    }
  };

  const handleReady = () => {
    if (bomb.every((value) => value == 0)) {
      socket.emit("player_ready", { roomId, bombPosition });
      socket.emit("send_data", { bombPosition, roomId });
      setBombPosition([]);
      setIsContinueTurn(!CONTINUE)
    }
  };

  return (
    <>
      <Modal
        isShow={isContinueTurn ? false : true}
        isEnd={isMatchEnd ? true : false}
        message={modalMessage}
      />
      <div className="px-4 py-4 flex flex-col items-end">
        <div className="w-full grid grid-flow-row grid-cols-1 text-center">
          <button
            onClick={handleDirection}
            className="text-white mr-1 bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Xoay chiều đặt bomb
          </button>
        </div>
        <section className={`grid h-96 w-96 grid-cols-10 gap-1 pt-4`}>
          {battleField.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="col-span-10 grid w-full grid-cols-10 last:border-b last:border-dashed last:border-black"
            >
              {row.map((col, colIndex) => (
                <button
                  id={JSON.stringify(col)}
                  key={colIndex}
                  className={`col-span-1 border border-b-0 border-r-0 border-dashed -mt-1 border-black ${
                    fieldPlace.some(
                      (field) => field.i === col.i && field.j === col.j
                    )
                      ? "bg-slate-300"
                      : ""
                  } ${
                    bombPosition.some((bomb) => {
                      return bomb.some((obj) => {
                        return obj.i === col.i && obj.j === col.j;
                      });
                    })
                      ? "bg-slate-300"
                      : ""
                  } last:border-r hover:bg-slate-300`}
                  onClick={() => handleClick(col)}
                  onMouseMove={() => handleMouseMove(col)}
                  onMouseLeave={handleMouseLeave}
                ></button>
              ))}
            </div>
          ))}
        </section>
        <button
          type="button"
          className="mt-4 text-white bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          onClick={handleReady}
        >
          Ready
        </button>
      </div>
    </>
  );
};

export default BattleField;
