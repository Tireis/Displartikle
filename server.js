// Requirements for the server
const express = require('express');
const fs = require('fs');
const path = require('path');
const WS = require("ws");

// app and websocket
const app = express();
const wss = new WS.Server({port: 3000})

// Returning the Path to the corresponding images
const imageDir = path.join(__dirname, 'target', 'images');

// Use static images / files
app.use(express.static(path.join(__dirname, 'target')));

wss.on('connection', (ws) => { // New client connects with the server
  console.log("Client connection opened");
  ws.send("Pictures sent")
});

