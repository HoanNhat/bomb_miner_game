function RandomRoomId(roomIdLength) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const roomIdLength = roomIdLength
  let roomId = ''

  for (let i = 0; i < roomIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    roomId += characters.charAt(randomIndex)
  }

  return roomId
}
export default RandomRoomId