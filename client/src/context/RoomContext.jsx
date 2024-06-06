import { createContext, useState } from 'react'

const RoomContext = createContext()

export const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null)

  return (
    <RoomContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </RoomContext.Provider>
  )
}

export default RoomContext