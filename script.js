const articleSpace = document.getElementById("articleSpace");

const socket = new WebSocket("ws://localhost:3000")

socket.onopen = () => {
    console.log("socket connection created")
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data).images;
    data.forEach(object => {
        console.log(`This object called ${object.name} has the state: ${object.state} and Image Path: ${object.url}`)
        let name = object.name
        if(String(name).length > 8){
            name = String(name).slice(0, 5) + "..."
        }

        createNewObject(object.url, object.state, name)
    });
}

socket.onerror = (err) => {
    console.log(`Websocket Error: ${err.message || err}`)
}

function createNewObject(imgPath, state, name){
    let object = document.createElement("div")
    object.className = `object ${state}`
    object.onclick = () => {
        changeState(object)
    }
    object.innerHTML = `
        <img class="soldImg" src="target/Ausverkauft_Banner.png" alt="[AUSVERKAUFT]">
        <img class="objectPicture" src="${imgPath}" alt="${name}">
        <p class="objectName">${name}</p>
    `
    document.getElementById("articleSpace").appendChild(object)
}

function changeState(object){
    object.classList.toggle("inactive")
    object.classList.toggle("active")
    let name = String(object.querySelector(`.objectPicture`).src).split('/') // returns a list of strings split by "/"
    // to get the exact last word without the file extension decoded: "file%20name.jpg" -> "file name"
    name = decodeURI(name[name.length - 1].split(".")[0]);
    const invertObjectState = {
        type: "function",
        function: "invertObjectState",
        params: name
    }
    socket.send(JSON.stringify(invertObjectState));
}