import io from "socket.io-client";
import { useNavigate } from 'react-router-dom'
import RoomContext from '../context/RoomContext'
import React, { useState, useEffect, useContext } from "react";

const socket = io('http://localhost:3001')

const BattleField = ({ battleSize, bomb, bombIsUsing, bombUsed }) => {
  const battleField = []
  const NO_BOMB_USING = -1
  
  const navigate = useNavigate()
  const { roomId } = useContext(RoomContext)
  const [socketData, setSocketData] = useState()
  const [fieldPlace, setfieldPlace] = useState([])
  const [bombPosition, setBombPosition] = useState([])
  const [bombDirection, setBombDirection] = useState("x")

  for (let i = 0; i < battleSize; i++) {
    const row = []
    for (let j = 0; j < battleSize; j++) {
      row.push({ i, j })
    }
    battleField.push(row)
  }

  useEffect(() => {
    if (!roomId) {
      navigate("/")
    }
  }, [])

  useEffect(() => {
    if (roomId) {
      socket.emit('join_room', roomId);
    }
  }, [roomId])

  useEffect(() => {
    socket.on('received_data', (data) => {
      console.log(data)
      setSocketData(data.bombPosition)
    })
  }, [socket])

  const handleMouseMove = (position) => {
    let start = { i: position.i, j: position.j }
    let range = bombDirection == "y" ? parseInt(start.j) + bombIsUsing + 1 : parseInt(start.i) + bombIsUsing + 1
    let field = [battleField[start.i][start.j]]

    if (range > 10 || bombIsUsing == NO_BOMB_USING) {
      return;
    } else {
      if (bombDirection == "y") {
        for (let i = 1; i <= bombIsUsing; i++) {
          const fieldFollow = battleField[start.i][start.j + i]
          field.push(fieldFollow)
        }
      } else {
        for (let i = 1; i <= bombIsUsing; i++) {
          const fieldFollow = battleField[start.i + i][start.j]
          field.push(fieldFollow)
        }
      }    
    }

    setfieldPlace(field)
  };

  const handleMouseLeave = () => {
    setfieldPlace([])
  };

  const handleDirection = (e) => {
    const direction = e.target.value
    setBombDirection(direction)
  }

  const handleClick = (position) => {
    if (bombIsUsing != NO_BOMB_USING) {
      setBombPosition((prev) => [...prev, fieldPlace])
      bomb[bombIsUsing] -= 1
      bombUsed(bomb)
    }
  };

  const handleReady = () =>  {
    if (bomb.every(value => value == 0)) {
     socket.emit('send_data', {bombPosition, roomId})
    }
  }

  return (
    <>
      <div className="px-4 py-4 flex flex-col items-end">
        <div className="w-full grid grid-flow-row grid-cols-2 text-center"> 
          <label className="col-span-4 font-medium" htmlFor="">Chọn chiều đặt bomb</label>
          <button onClick={handleDirection} value="x" className="text-white mr-1 bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5">Dọc</button>
          <button onClick={handleDirection} value="y" className="text-white ml-1 bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5">Ngang</button>
        </div>
        <section className={`grid h-96 w-96 grid-cols-10 gap-1 pt-4`}>
          {battleField.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="col-span-10 grid w-full grid-cols-10 last:border-b last:border-dashed last:border-black"
            >
              {row.map((col, colIndex) => (
                <button
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
      </div>
    </>
  );
};

export default BattleField;
