const constans = require("./src/app/models/constants");

const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

io.on(constans.connection, socket => {
  console.log(`Socket conectado: ${socket.id}`);

  //socket.emit('previousMessages', messages);

  socket.on(constans.start, data => {
    data.id = socket.id;
    socket.broadcast.emit(constans.start, data);
    socket.emit(constans.start, data);
  });

  socket.on(constans.move, data => {
    socket.broadcast.emit(constans.move, data);
  });

  socket.on(constans.connected, data => {
    messages.push(data);
    socket.broadcast.emit(constans.receiveMessage, data);
  });
});

console.log("Servidor conectado!!");

server.listen(process.env.PORT || 3000);
