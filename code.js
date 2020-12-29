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
    componenttable = document.querySelector("table");
    hue = document.getElementById("hue").value;
    flarecenter = [parseFloat(document.getElementById("flarex").value), parseFloat(document.getElementById("flarey").value)];
    hotspottype = componenttable.rows[1].cells[1].children[0].value;
    streaktype = componenttable.rows[2].cells[1].children[0].value;
    iristype = componenttable.rows[3].cells[1].children[0].value;
    halotype = componenttable.rows[4].cells[1].children[0].value;
    hotspotscale = [parseFloat(componenttable.rows[1].cells[2].children[0].value), parseFloat(componenttable.rows[1].cells[3].children[0].value)];
    streakscale = [parseFloat(componenttable.rows[2].cells[2].children[0].value), parseFloat(componenttable.rows[2].cells[3].children[0].value)];
    irisscale = [parseFloat(componenttable.rows[3].cells[2].children[0].value), parseFloat(componenttable.rows[3].cells[3].children[0].value)];
    haloscale = [parseFloat(componenttable.rows[4].cells[2].children[0].value), parseFloat(componenttable.rows[4].cells[3].children[0].value)];

    //set filters
    ctx.filter = "hue-rotate(" + hue + "deg)";

    //clear old drawing
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, docWidth, docHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //add elements
    if (streaktype != "None") {
        addArtifact("textures/streakleft" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth + (flarecenter[0] - docWidth / 2) * 1.5) / 1.25 * streakscale[0], docHeight / 5 * streakscale[1]);
        addArtifact("textures/streakright" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth - (flarecenter[0] - docWidth / 2) * 1.5) / 1.25 * streakscale[0], docHeight / 5 * streakscale[1]);
    }
    if (hotspottype != "None") {
        addArtifact("textures/hotspot" + hotspottype + ".png", flarecenter[0], flarecenter[1], docHeight / 2.7 * hotspotscale[0], docHeight / 2.7 * hotspotscale[1]);
    }
    if (halotype != "None") {
        addArtifact("textures/halo" + halotype + ".png", flarecenter[0], flarecenter[1], docHeight / 1.75 * haloscale[0], docHeight / 1.75 * haloscale[1]);
    }
    if (iristype != "None") {
        Math.seedrandom(NaN);

        // multi-iris towards camera
        currentx = flarecenter[0];
        currenty = flarecenter[1];
        for (i = 0; i < 45; i++) {
            currentx += (docWidth / 2 - flarecenter[0]) / 20;
            currenty += (docHeight / 2 - flarecenter[1]) / 20;
            if (Math.random() < 0.35) {
                sclFac = Math.random() * (i / 30);
                ctx.globalAlpha = Math.random() / 2;
                addArtifact("textures/iris" + iristype + ".png", currentx, currenty, docHeight / 2 * sclFac * irisscale[0], docHeight / 2 * sclFac * irisscale[1]);
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
                ctx.globalAlpha = Math.random() / 2;
                addArtifact("textures/iris" + iristype + ".png", currentx, currenty, docHeight / 2 * sclFac * irisscale[0], docHeight / 2 * sclFac * irisscale[1]);
                ctx.globalAlpha = 1;
            }
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
for (inputbox of document.querySelectorAll("select, input[type=number], input[type=range]")) {
    inputbox.onchange = draw;
}
//export overlay
document.getElementsByTagName("button")[0].onclick = download;
draw();