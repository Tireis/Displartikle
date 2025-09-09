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

// Scrolling in the Website up and down to show everything:
function autoScrollPresentation(speed = 1, pauseTime = 2000) {
    let direction = 1; // 1: down, -1: up
    let scrollInterval;
    let interactionTimeout;
    let isInteracting = false;

    function startScrolling() {
        scrollInterval = setInterval(() => {
            if (isInteracting) return;

            window.scrollBy(0, direction * speed);

            const scrollTop = window.scrollY;
            const scrollHeight = document.body.scrollHeight;
            const windowHeight = window.innerHeight;

            // Reached bottom
            if (scrollTop + windowHeight >= scrollHeight) {
                direction = -1;
                resetTimeout;
            }

            // Reached top
            if (scrollTop <= 0) {
                direction = 1;
                resetTimeout;
            }
        }, 20); // scroll every 20ms
    }

    function resetTimeout() {
        isInteracting = true;
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
            isInteracting = false;
        }, 1000); // resume after 1s of no interaction
    }

    // Detect user interactions
    ['mousemove', 'keydown', 'wheel', 'touchstart'].forEach(event => {
        window.addEventListener(event, resetTimeout, { passive: true });
    });

    startScrolling();
}

autoScrollPresentation()