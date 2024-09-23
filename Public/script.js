// client-side js, loaded by index.html
// run by the browser each time the page is loaded

let socket = io();
let loginPage = document.getElementById("loginPage");
let username;

socket.on("update user list", usernameList => {
  updateUsernameList(usernameList);
});

socket.on("return username", () => {
  socket.emit("entered username", username);
});

socket.on("update user count", numUsers => {
  document.getElementById("userCount").innerHTML =
    "There are currently " + numUsers.toString() + " users online: ";
});

socket.on("display message", info => {
  let message = info[0];
  let sender = info[1];
  let messageBox = document.getElementById("messages");
  var listItem = document.createElement("LI");
  var text = document.createTextNode(sender + ": " + message);
  listItem.appendChild(text);
  messageBox.appendChild(listItem);
  messageBox.scrollTop = messageBox.scrollHeight;
});

document.getElementById("usernameInput").onkeypress = event => {
  if (event.keyCode == 13 || event.which == 13) {
    submitUsername()
  }
};

document.getElementById("messageInput").onkeypress = event => {
  if (event.keyCode == 13 || event.which == 13) {
    submitMessage()
  }
};

function submitUsername() {
  username = document.getElementById("usernameInput").value;
  if (username) {
    loginPage.style.display = "none";
    displayMainPage();
    socket.emit("entered username", username);
  }
}

function submitMessage() {
  let message = document.getElementById("messageInput").value;
  if (message) {
    socket.emit("send message", [message, username]);
    document.getElementById("messageInput").value = "";
    document.getElementById("messageInput").focus();
  }
}

function displayMainPage() {
  document.getElementById("title").style.display = "block";
  document.getElementById("userCount").style.display = "block";
  document.getElementById("userList").style.display = "block";
  document.getElementById("messages").style.display = "block";
  document.getElementById("messageInput").style.display = "block";
  document.getElementById("submitMessage").style.display = "block";
}

function updateUsernameList(usernameList) {
  document.getElementById("userList").innerHTML = usernameList.join(", ");
}
