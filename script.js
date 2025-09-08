const articleSpace = document.getElementById("articleSpace");

async function getImages(){
    try{
        const res = await fetch("http://localhost:3000/api/images");
        if(!res.ok){
            throw new Error(`Error with Server connection: [${res.status}]`);
        }
        const imgs = await res.json();
        console.log(imgs)
    }catch (err){
        console.error(`Error with function getImages: ${err}`)
    }
}

function createNewObject(imgPath, state){
    let name = "Stripax"; // imgPath.split("/")
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
}

getImages()