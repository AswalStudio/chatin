const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));

const ROOM_PASSWORDS = {
  SSSJIS: "#7430$",
  WAGON: "PAZz0%",
  Y2M$: "7R0Mnk(i)",
  CHUPk0: "Az1Bu42&"
};

io.use((socket, next) => {
  const { username, room, password } = socket.handshake.auth;

  if (!ROOM_PASSWORDS[room]) return next(new Error("Room does not exist"));
  if (ROOM_PASSWORDS[room] !== password) return next(new Error("Incorrect password"));

  socket.username = username;
  socket.room = room;
  next();
});

io.on("connection", (socket) => {
  const { username, room } = socket;

  socket.join(room);
  socket.to(room).emit("message", `${username} joined ${room}`);

  socket.on("message", (msg) => {
    io.to(room).emit("message", `${username}: ${msg}`);
  });

  socket.on("disconnect", () => {
    socket.to(room).emit("message", `${username} left`);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
