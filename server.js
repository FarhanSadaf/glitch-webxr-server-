const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', ws => {
    console.log('New client connected');

    // Handle incoming messages from clients
    ws.on('message', message => {
        try {
            // Attempt to parse the message as JSON
            const data = JSON.parse(message);
            console.log('Received movement data:', data);
        } catch (error) {
            console.error('Failed to parse message:', message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
