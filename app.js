const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");
require("dotenv/config");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//middlewares
app.use(cors());
app.use(express.json());

//import routes
app.use(express.static(path.join(__dirname, "public")));

let currentUsers = new Set();
let currentValue = 0;

//run when client connects
io.on("connection", (socket) => {
  currentUsers.add(socket.id);

  //updates current value and broadcasts it
  socket.on("currentValue", (value) => {
    currentValue = value;
    socket.broadcast.emit("currentValue", {
      value: currentValue,
    });
  });

  //send confirmation to sensor
  socket.on("confirmation", (confirmation) => {
    socket.broadcast.emit("userConfirmation", {
      user: socket.id,
      value: confirmation,
    });
  });

  //updates current users
  io.emit("currentUsers", {
    users: currentUsers.size,
  });

  //runs on disconnection
  socket.on("disconnect", () => {
    currentUsers.delete(socket.id);
    io.emit("currentUsers", {
      users: currentUsers.size,
    });
  });
});

//listen to server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
