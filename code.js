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
    ctx.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
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
    hotspottype = document.querySelector("#Hotspot select").value;
    streaktype = document.querySelector("#Streak select").value;
    iristype = document.querySelector("#Iris select").value;
    halotype = document.querySelector("#Halo select").value;
    hotspotscale = Array.from(document.querySelectorAll("#Hotspot input[type=number]")).map(x => parseFloat(x.value));
    streakscale = Array.from(document.querySelectorAll("#Streak input[type=number]")).map(x => parseFloat(x.value));
    irisscale = Array.from(document.querySelectorAll("#Iris input[type=number]")).map(x => parseFloat(x.value));
    haloscale = Array.from(document.querySelectorAll("#Halo input[type=number]")).map(x => parseFloat(x.value));
    streakbalance = parseFloat(document.querySelectorAll("#Streak input[type=number]")[2].value);

    //set filters
    ctx.filter = "hue-rotate(" + hue + "deg)";

    //clear old drawing
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, docWidth, docHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //add elements
    if (streaktype != "None") {
        addArtifact("textures/streakleft" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth + (flarecenter[0] - docWidth / 2) * streakbalance) / 1.25 * streakscale[0], docHeight / 5 * streakscale[1]);
        addArtifact("textures/streakright" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth - (flarecenter[0] - docWidth / 2) * streakbalance) / 1.25 * streakscale[0], docHeight / 5 * streakscale[1]);
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

//collapsable stuff
for (collapsable of document.querySelectorAll("#Hotspot, #Streak, #Iris, #Halo")) {
    collapsable.style.display = "none";
    document.getElementById(collapsable.id + "_handle").setAttribute("onclick", `
    if (document.getElementById('` + collapsable.id + `').style.display == 'none') {
        document.getElementById('` + collapsable.id + `').style.display = 'block';
        this.innerHTML = '&#x25BE; ` + collapsable.id + `';
    }
    else {
        document.getElementById('` + collapsable.id + `').style.display = 'none';
        this.innerHTML = '&#x25B8; ` + collapsable.id + `';
    }
    `);
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
    document.getElementById("optionspannel").appendChild(photopea_button);
    photopea_button.onclick = photopea_build;
}

//update preview
for (inputbox of document.querySelectorAll("select, input[type=number], input[type=range]")) {
    inputbox.onchange = draw;
}
//export overlay
document.getElementsByTagName("button")[0].onclick = download;
draw();