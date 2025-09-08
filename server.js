// Requirements for the server
const express = require('express');
const fs = require('fs');
const path = require('path');
const WS = require("ws");

// Returning the Path to the corresponding images
const imageDir = path.join(__dirname, 'target', 'images');

function getImages(){
  const files = fs.readdirSync(imageDir);
  let objectStates = {}

  // load JSON if file exists
  if (fs.existsSync('objectsList.json')) {
    try {
      const jsonData = fs.readFileSync('objectsList.json', 'utf-8');
      objectStates = JSON.parse(jsonData);
    } catch (err) {
      console.error("err on reading JSON:", err);
    }
  }


  return files.map(file => {
    const name = file.split(".")[0];
    const found = objectStates.find(object => object.name == name);
    const state = found ? found.state : "active" // Checks the state inside the JSON

    console.log(state)
    
    return { // returns every file as JSON
      filename: file,
      name: name,
      state: state,
      url: `target/images/${file}`
    }
  });
}

// Websocket Server
const ws = new WS.Server({port: 3000}, () => {
  try {
    const data = getImages(); // Assume this returns an object or array
    const jsonData = JSON.stringify(data, null, 2); // Convert to formatted JSON string
    fs.writeFileSync('objectsList.json', jsonData);
    console.log('JSON file created successfully');
  } catch (err) {
    console.error('Error writing file:', err);
  }
})
console.log(`Websocket Server runs on Port: 3000`)

ws.on('connection', (socket) => { // New client connects with the server
  console.log("Client connected");
  socket.send(JSON.stringify({
    images: getImages()
  }))
});