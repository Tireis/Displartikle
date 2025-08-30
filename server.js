// Requirements for the server
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// app and websocket
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Returning the Path to the corresponding images
const imageDir = path.join(__dirname, 'target', 'images');

// Use static images / files
app.use(express.static(path.join(__dirname, 'target')));

// API Endpoints for the imagelist
app.get('/api/images', (req, res) => {
  fs.readdir(imageDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'An error occured while reading the directory.' });

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(imageFiles);
  });
});

// Broadcasts the client for new incomming image files
function broadcastNewImages() {
  fs.readdir(imageDir, (err, files) => {
    if (err) return;

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const message = JSON.stringify({ type: 'update', images: imageFiles });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
}


// Watches the corresponding directory for each new file
fs.watch(imageDir, (eventType, filename) => {
  if (/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
    console.log(`Changes recognized: ${filename}`);
    broadcastNewImages();
  }
});

// Run the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
