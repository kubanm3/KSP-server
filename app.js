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
const connectionsLimit = 5;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

let currentUsers = new Array(connectionsLimit).fill(0);

io.on("connection", (socket) => {
  io.emit("currentUsers", {
    users: countUsers(),
  });

  socket.on("createRoom", function (room) {
    if (countUsers() >= connectionsLimit) {
      socket.emit(
        "err",
        "Max number of users surpassed, limit: " + connectionsLimit
      );
      socket.disconnect();
      return;
    }
    socket.join(room);
    currentUsers[currentUsers.indexOf(0)] = socket.id;

    io.emit("currentUsers", {
      users: countUsers(),
    });
  });

  socket.on("currentValue", (currentValue) => {
    socket.broadcast.emit("currentValue", {
      value: currentValue,
    });
  });

  socket.on("confirmation", (confirmation) => {
    socket.broadcast.emit("userConfirmation", {
      user: currentUsers.indexOf(socket.id) + 1,
      value: confirmation,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("userConfirmation", {
      user: currentUsers.indexOf(socket.id) + 1,
      value: false,
    });
    currentUsers[currentUsers.indexOf(socket.id)] = 0;
    io.emit("currentUsers", {
      users: countUsers(),
    });
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function countUsers() {
  return currentUsers.filter(function (value) {
    return value !== 0;
  }).length;
}