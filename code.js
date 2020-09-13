//initiate vars
docWidth = parseFloat(location.search.split("canvaswidth=")[1]);
docHeight = parseFloat(location.search.split("canvasheight=")[1]);

//go back if url is not valid
if (Number.isNaN(docWidth) || Number.isNaN(docHeight)) {
    location.replace("index.html");
}

//initiate canvas
canvas = document.getElementById('canvas');
canvas.style.backgroundColor = "#000000";
canvas.width = docWidth;
canvas.height = docHeight;
ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = "lighter";

function addArtifact(imgsrc, centerx, centery, width, height) {
    image = new Image();
    image.src = imgsrc;
    //position by centerpoint
    x = centerx - width/2;
    y = centery - height/2;
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, x, y, width, height);
}

//download link - thanks to https://stackoverflow.com/users/3986879/ulf-aslak
var download = function(){
    var link = document.createElement("a");
    link.download = "scififlare.jpg";
    link.href = canvas.toDataURL("image/jpg");
    link.click();
}

function draw() {
    //read user input
    flarecenter = [document.getElementById("flarex").value, document.getElementById("flarey").value];

    //clear old drawing
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, docWidth, docHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //add elements
    addArtifact("streakleft1.png", flarecenter[0], flarecenter[1], docWidth + (flarecenter[0] - docWidth / 2) * 1.5, docHeight / 6);
    addArtifact("streakright1.png", flarecenter[0], flarecenter[1], docWidth - (flarecenter[0] - docWidth / 2) * 1.5, docHeight / 6);
    addArtifact("hotspot1.png", flarecenter[0], flarecenter[1], docHeight / 4, docHeight / 4);
    addArtifact("iris1.png", docWidth / 2, docHeight / 2, docHeight / 10, docHeight / 10);

    //update preview
    document.getElementById("flarepreview").setAttribute("src", canvas.toDataURL("image/jpg"));
}

function genArrayBuffer() {
    ctx = canvas.getContext("2d");
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data.buffer;
}

function checkIframe() {
    try {
        myNewVar = window.self != window.top;
    } catch (e) {
        return true;
    }
}

//if (checkIframe()) { //if in iframe (using as photopea plugin)
    //create button element
    sendToPhotopeaButton = document.createElement("button");
    sendToPhotopeaButton.innerText = "Send to Photopea";

    //add a line break
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    //add button to document
    document.getElementsByTagName("div")[0].appendChild(sendToPhotopeaButton);

    //add onclick
    sendToPhotopeaButton.onclick = function() {
        window.parent.postMessage(genArrayBuffer(), "*");
    }
//}

//update preview
document.getElementsByTagName("button")[0].onclick = draw;
//export overlay
document.getElementsByTagName("button")[1].onclick = download;
draw();