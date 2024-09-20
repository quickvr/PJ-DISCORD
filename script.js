// script.js

const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

const socket = new WebSocket('ws://YOUR_WEBSOCKET_SERVER');

socket.onmessage = function(event) {
    const message = document.createElement('div');
    message.textContent = event.data;
    chatBox.appendChild(message);
};

sendButton.addEventListener('click', function() {
    const message = chatInput.value;
    socket.send(message);
    chatInput.value = '';
});
