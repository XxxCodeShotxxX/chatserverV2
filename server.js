const express = require("express");
const cors = require("cors");
const { connectToDb } = require("./controllers/db_controller");
const keys = require("./keys");
const http = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const mongoose = require("mongoose");
const user = require('./models/user_model');

//------------------------------- controllers
const userController = require('./controllers/user_controller');

//------------------------------- setting up express server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
})
//-------------------------------- add middleware
app.use(express.json());
app.use(express.static("uploads"))
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  req.io = io
  req.serverIp = keys.serverIp
  return next()
})
//---------------------------------- add routes
app.use("/testing", require('./routes/testing'))
app.use("/auth", require('./routes/auth_routes'))
app.use("/message", require('./routes/message_routes'))
app.use("/user", require('./routes/user_routes'))
//--------------------------------- setting up routes
app.get("/", (req, res) => {
  res.send("Hello World");
})


//--------------------------------- setting up admin ui
instrument(io, {
  auth: false,
  mode: "development",
});
//------------------------------- setting up invalid requests
app.get("*", (req, res) => {
  console.log("invalid request ", req.method, " ", req.url);
  res.status(401).json({ error: "Invalid Request" });
})
app.post("*", (req, res) => {
  console.log("invalid request ", req.method, " ", req.url);
  res.status(401).json({ error: "Invalid Request" });
})
app.put("*", (req, res) => {
  console.log("invalid request ", req.method, " ", req.url);
  res.status(401).json({ error: "Invalid Request" });
})
app.delete("*", (req, res) => {
  console.log("invalid request ", req.method, " ", req.url);
  res.status(401).json({ error: "Invalid Request" });
})

//--------------------------------- socket middleware
const socketMiddleware = require("./middleware/socket_middleware");
io.use(socketMiddleware);

//--------------------------------- setting up socket io
io.on("connection", (socket) => {
  // update online status and socket id


  userController.onUserConnect(socket, io);




  // connect error
  socket.on("connect_error", (err) =>
    console.log(`connect_error due to ${err.message}`)
  );


  // disconnect
  socket.on("disconnect", () => {
    userController.disconnectUser(socket, io);
    console.log(socket.data.userName, " disconnected");
  });
})


//----------------------------------------------------------- setting up server
const start = async () => {

  await connectToDb();
  console.log("Db connected");
  server.listen(keys.PORT, "0.0.0.0", () => {
    console.log("server started on port 5000");
  });
}


start();