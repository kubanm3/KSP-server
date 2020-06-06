const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//run when client connects
io.on("connection", (socket) => {
  console.log("New websocket connection");

  //welcome current user
  socket.emit("message", "Welcome to ksp server");

  //broadcast to other users
  socket.broadcast.emit("message", "new connection has been made");

  //runs on disconnection
  socket.on("disconnect", () => {
    io.emit("message", "user disconnected");
  });
});

const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());

//import routes
const postsRoute = require("./routes/posts");
app.use("/posts", postsRoute);

//ROUTES
app.get("/", (req, res) => {
  res.send("We are on home");
});

//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("connected to db!")
);

//listen to server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
