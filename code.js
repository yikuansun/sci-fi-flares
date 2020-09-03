//initiate vars
docWidth = parseFloat(location.search.split("canvaswidth=")[1]);
docHeight = parseFloat(location.search.split("canvasheight=")[1]);

//go back if url is not valid
if (Number.isNaN(docWidth) || Number.isNaN(docHeight)) {
    location.replace("index.html");
}

canvas = document.getElementById('canvas');
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

    //add elements
    addArtifact("iris1.png", docWidth / 2, docHeight / 2, 20, 20);

    //update preview
    document.getElementById("flarepreview").setAttribute("src", canvas.toDataURL("image/jpg"));
}

document.getElementsByTagName("button")[0].onclick = draw;
draw();