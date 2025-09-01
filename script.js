const articleSpace = document.getElementById("articleSpace");

var objects = []

function createNewObject(imgPath, state){
    let name = "Stripax"; // imgPath.split("/")
    objects.push(`
            <div class="object `, state, `">
                <img class="objectPicture" src="`, imgPath, `" alt="`, name, `">
                <p class="objectName">`, name, `</p>
            </div>`);
}

function changeState(object){
    object.classList.toggle("inactive")
    object.classList.toggle("active")
}