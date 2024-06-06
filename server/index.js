const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

var room = {
  players: [],
  numPlayers: 2,
};

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => {
    const isInRoom = socket.rooms.has(room);
    if (isInRoom) {
      socket.leaveAll();
    }
    
    if (roomId != null) {
      socket.join(roomId);
      console.log(socket.id, "join", roomId);
    }
  });

  socket.on("player_ready", (data) => {
    const player = {id: socket.id, bombPosition: data.bombPosition}
    room.players.push(player)

    if (room.players.length == 1) {
      socket.to(data.roomId).emit("send_data", room.players[0].bombPosition)
    } else {
      socket.to(data.roomId).emit("send_data", room.players[1].bombPosition) 
    }
    
    if (room.numPlayers === room.players.length) {
      io.to(data.roomId).emit("match_start");
      room.players = [];
    }
  });

  socket.on('opponent_turn', (roomId) => {
    socket.to(roomId).emit("player_turn");
  });

  socket.on('match_win', (data) => {
    io.to(data[1]).emit("winner", data[0])
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
  });
});

server.listen(3001, () => {
  console.log("Server is running...");
});
