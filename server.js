// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
let messages = []

let numUsers = 0;
let usernameList = [];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

io.on("connection", socket => {
  console.log("a user connected!");
  ++numUsers;
  console.log("There are currently " + numUsers + " users.");
  io.emit("update user count", numUsers)
  for (let i = 0; i < messages.length; i++) {
    socket.emit("display message", messages[i])
  }

  socket.on("disconnecting", () => {
    usernameList = []
    io.emit("return username");
    console.log("a user disconnected.");
    --numUsers;
    console.log("There are currently " + numUsers + " users.");
    io.emit("update user count", numUsers)
    if (numUsers == 0 && Array.isEmpty(usernameList)) {
      messages = []
    }
  });

  socket.on("entered username", username => {
    usernameList.push(username);
    io.emit("update user list", usernameList);
  });
  
  socket.on("send message", (data) => {
    //access message with data[0], name with data[1]
    let message = data[0]
    let sender = data[1]
    messages.push([message, sender])
    io.emit("display message", [message, sender])
  })
});

// listen for requests :)
const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
