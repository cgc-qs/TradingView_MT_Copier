const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:80');

socket.onmessage = function(event) {
    const signal = JSON.parse(event.data);
    console.log('Received signal:', signal);
};

// Example of handling connection open event
socket.onopen = function() {
    console.log('WebSocket connection opened');
};

// Example of handling connection close event
socket.onclose = function() {
    console.log('WebSocket connection closed');
};