const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Parser } = require('json2csv');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory storage for incoming data
let sensorData = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Handle incoming messages from clients
    ws.on('message', (message) => {
        try {
            // Attempt to parse the message as JSON
            const data = JSON.parse(message);
            console.log('Received movement data:', data);

            // Add the data to the sensorData array
            sensorData.push({
                timestamp: data.timestamp,
                head_x: data.head.position[0],
                head_y: data.head.position[1],
                head_z: data.head.position[2],
                head_roll: data.head.rotation[0],
                head_pitch: data.head.rotation[1],
                head_yaw: data.head.rotation[2],
                controller1_x: data.controller1.position[0],
                controller1_y: data.controller1.position[1],
                controller1_z: data.controller1.position[2],
                controller1_roll: data.controller1.rotation[0],
                controller1_pitch: data.controller1.rotation[1],
                controller1_yaw: data.controller1.rotation[2],
                controller2_x: data.controller2.position[0],
                controller2_y: data.controller2.position[1],
                controller2_z: data.controller2.position[2],
                controller2_roll: data.controller2.rotation[0],
                controller2_pitch: data.controller2.rotation[1],
                controller2_yaw: data.controller2.rotation[2]
            });
        } catch (error) {
            console.error('Failed to parse message:', message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Endpoint to download data as CSV
app.get('/download', (req, res) => {
    if (sensorData.length === 0) {
        return res.status(400).send('No data available to download.');
    }

    try {
        // Convert the sensor data to CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(sensorData);

        // Clear the stored data
        sensorData = [];

        // Send the CSV file as a response
        res.header('Content-Type', 'text/csv');
        res.attachment('sensor_data.csv');
        res.send(csv);
    } catch (error) {
        console.error('Failed to generate CSV:', error);
        res.status(500).send('Failed to generate CSV.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});