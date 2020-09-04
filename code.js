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
ctx.globalCompositeOperation = 'screen'; //due to absense of linear dodge (add), which is preferable imo

function addArtifact(imgsrc, centerx, centery, width, height) {
    image = new Image();
    image.src = imgsrc;
    x = centerx - width/2;
    y = centery - height/2;
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, x, y, width, height);
}

function draw() {
    //read user input
    flarecenter = [document.getElementById("flarex").value, document.getElementById("flarey").value]

    //clear old drawing
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, docWidth, docHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //add elements
    addArtifact("streakleft1.png", flarecenter[0], flarecenter[1], docHeight - (flarecenter[0] - docWidth / 2) / docWidth, docHeight / 7);
    addArtifact("streakright1.png", flarecenter[0], flarecenter[1], docHeight + (flarecenter[0] - docWidth / 2) / docWidth, docHeight / 7);
    addArtifact("hotspot1.png", flarecenter[0], flarecenter[1], docHeight / 6, docHeight / 6);
    addArtifact("iris1.png", docWidth / 2, docHeight / 2, docHeight / 10, docHeight / 10);

    //update preview
    document.getElementById("flarepreview").setAttribute("src", canvas.toDataURL("image/jpg"));
}

document.getElementsByTagName("button")[0].onclick = draw;
draw();