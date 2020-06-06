const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv/config");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let currentUsers = 0;

//run when client connects
io.on("connection", (socket) => {
  console.log("New websocket connection");
  console.log("socket", socket);
  currentUsers++;
  console.log(currentUsers);
  //welcome current user
  socket.emit("message", "Welcome to ksp server");

  //broadcast to other users
  socket.broadcast.emit("message", "new connection has been made");

  io.emit("currentUsers", {
    users: currentUsers,
  });

  //runs on disconnection
  socket.on("disconnect", () => {
    io.emit("message", "user disconnected");
    console.log("user disconnected");
    currentUsers--;
    io.emit("currentUsers", {
      users: currentUsers,
    });
  });
});

const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());

//import routes
app.use(express.static(path.join(__dirname, "public")));

// //connect to db
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
//   console.log("connected to db!")
// );

//listen to server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
