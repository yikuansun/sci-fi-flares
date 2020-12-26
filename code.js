//initiate vars
pageURL = new URL(location.href);
docWidth = parseFloat(pageURL.searchParams.get("canvaswidth"));
docHeight = parseFloat(pageURL.searchParams.get("canvasheight"));

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
    link.download = "scififlare.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function draw() {
    //read user input
    hue = document.getElementById("hue").value;
    flarecenter = [parseFloat(document.getElementById("flarex").value), parseFloat(document.getElementById("flarey").value)];
    hotspottype = document.getElementById("hotspottype").value;
    streaktype = document.getElementById("streaktype").value;
    iristype = document.getElementById("iristype").value;
    halotype = document.getElementById("halotype").value;

    //set filters
    ctx.filter = "hue-rotate(" + hue + "deg)";

    //clear old drawing
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, docWidth, docHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //add elements
    addArtifact("textures/streakleft" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth + (flarecenter[0] - docWidth / 2) * 1.5) / 1.25, docHeight / 5);
    addArtifact("textures/streakright" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth - (flarecenter[0] - docWidth / 2) * 1.5) / 1.25, docHeight / 5);
    addArtifact("textures/hotspot" + hotspottype + ".png", flarecenter[0], flarecenter[1], docHeight / 4, docHeight / 4);
    addArtifact("textures/halo" + halotype + ".png", flarecenter[0], flarecenter[1], docHeight / 1.75, docHeight / 1.75);

    Math.seedrandom(NaN);

    // multi-iris towards camera
    currentx = flarecenter[0];
    currenty = flarecenter[1];
    for (i = 0; i < 50; i++) {
        currentx += (docWidth / 2 - flarecenter[0]) / 20;
        currenty += (docHeight / 2 - flarecenter[1]) / 20;
        if (Math.random() < 0.35) {
            sclFac = Math.random() * (i / 30);
            ctx.globalAlpha = Math.random() / 3;
            addArtifact("textures/iris" + iristype + ".png", currentx, currenty, docHeight / 2.5 * sclFac, docHeight / 2.5 * sclFac);
            ctx.globalAlpha = 1;
        }
    }

    // multi-iris away from camera
    currentx = flarecenter[0];
    currenty = flarecenter[1];
    for (i = 0; i < 15; i++) {
        currentx -= (docWidth / 2 - flarecenter[0]) / 20;
        currenty -= (docHeight / 2 - flarecenter[1]) / 20;
        if (Math.random() < 0.35) {
            sclFac = Math.random() * (i / 30);
            ctx.globalAlpha = Math.random() / 3;
            addArtifact("textures/iris" + iristype + ".png", currentx, currenty, docHeight / 2.5 * sclFac, docHeight / 2.5 * sclFac);
            ctx.globalAlpha = 1;
        }
    }
}


//send to photopea
function photopea_build() {
    base64 = canvas.toDataURL("image/png").split(';base64,')[1];
    binary_string = window.atob(base64);
    bytes = new Uint8Array(binary_string.length);
    for (i = 0; i < binary_string.length; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    window.parent.postMessage(bytes.buffer, "*");
    window.parent.postMessage("app.activeDocument.activeLayer.blendMode = 'lddg'", "*");
}

//only show photopea button if in iframe
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

//photopea thing
if (inIframe()) {
    photopea_button = document.createElement("button");
    photopea_button.innerText = "Add to document (Photopea)";
    document.getElementsByTagName("center")[0].appendChild(photopea_button);
    photopea_button.onclick = photopea_build;
}

//update preview
document.getElementById("hue").onchange = draw;
document.getElementById("flarex").onchange = draw;
document.getElementById("flarey").onchange = draw;
document.getElementById("hotspottype").onchange = draw;
document.getElementById("streaktype").onchange = draw;
document.getElementById("iristype").onchange = draw;
document.getElementById("halotype").onchange = draw;
//export overlay
document.getElementsByTagName("button")[0].onclick = download;
draw();