const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

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
app.listen(3000);
