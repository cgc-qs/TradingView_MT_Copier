const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require("cors");
var corsOptions = {
    origin: "http://localhost:80"
};


// Create an Express app
const app = express();
const port = process.env.PORT || 80;
app.use(cors(corsOptions));

// Set up body parser to handle JSON POST requests
app.use(bodyParser.json());

// Create an HTTP server using the Express app
const server = require('http').createServer(app);

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// Store all connected WebSocket clients
const clients = new Set();

// Handle new WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Remove the client from the set when it disconnects
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });

    ws.on('message', data => {
        wss.clients.forEach(client => {
          console.log(`distributing message: ${data}`)
          //client.send(`${data}`)
        })
      })
});

app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to Jonathan Remote Copier." });  
});

// Define a POST endpoint to receive TradingView signals
app.post('/RemoteCopier/AlertSignal', (req, res) => {
    const signal = req.body; // Assuming the signal is in JSON format
    console.log('Received signal:', signal);

    // Broadcast the signal to all connected WebSocket clients
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(signal));
        }
    });

    // Respond to TradingView
    res.sendStatus(200);
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
