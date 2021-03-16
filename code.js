//initiate vars
const pageURL = new URL(location.href);
const docWidth = parseFloat(pageURL.searchParams.get("canvaswidth"));
const docHeight = parseFloat(pageURL.searchParams.get("canvasheight"));

//go back if url is not valid
if (Number.isNaN(docWidth) || Number.isNaN(docHeight)) {
    location.replace("index.html");
}

//initiate canvas
var canvas = document.getElementById('canvas');
canvas.style.backgroundColor = "#000000";
canvas.width = docWidth;
canvas.height = docHeight;

//download link - thanks to https://stackoverflow.com/users/3986879/ulf-aslak
var download = function(){
    var link = document.createElement("a");
    link.download = "scififlare.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function draw() {
    //read user input
    var hue = document.getElementById("hue").value;
    var flarecenter = [parseFloat(document.getElementById("flarex").value), parseFloat(document.getElementById("flarey").value)];
    var hotspottype = document.querySelector("#Hotspot select").value;
    var streaktype = document.querySelector("#Streak select").value;
    var iristype = document.querySelector("#Iris select").value;
    var halotype = document.querySelector("#Halo select").value;
    var hotspotscale = Array.from(document.querySelectorAll("#Hotspot input[type=number]")).map(x => parseFloat(x.value));
    var streakscale = Array.from(document.querySelectorAll("#Streak input[type=number]")).map(x => parseFloat(x.value));
    var irisscale = Array.from(document.querySelectorAll("#Iris input[type=number]")).map(x => parseFloat(x.value));
    var haloscale = Array.from(document.querySelectorAll("#Halo input[type=number]")).map(x => parseFloat(x.value));
    var streakbalance = parseFloat(document.querySelectorAll("#Streak input[type=number]")[2].value);
    var seed = document.querySelectorAll("#Iris input[type=text]")[0].value;

    lensflare(canvas, hue, flarecenter, hotspottype, streaktype, iristype, halotype, hotspotscale, streakscale, irisscale, haloscale, streakbalance, seed);
}

//presets
function setPreset(hue, hotspottype, hotspotscale, streaktype, streakscale, streakbalance, iristype, irisscale, seed, halotype, haloscale) {
    document.getElementById("hue").value = hue;
    document.querySelector("#Hotspot select").value = hotspottype;
    document.querySelector("#Streak select").value = streaktype;
    document.querySelector("#Iris select").value = iristype;
    document.querySelector("#Halo select").value = halotype;
    for (i = 0; i < 2; i++) {
        document.querySelectorAll("#Hotspot input[type=number]")[i].value = hotspotscale[i];
        document.querySelectorAll("#Streak input[type=number]")[i].value = streakscale[i];
        document.querySelectorAll("#Iris input[type=number]")[i].value = irisscale[i];
        document.querySelectorAll("#Halo input[type=number]")[i].value = haloscale[i];
    }
    document.querySelectorAll("#Streak input[type=number]")[2].value = streakbalance;
    document.querySelectorAll("#Iris input[type=text]")[0].value = seed;
    draw();
}

const presets = {
    "Default": [0, 1, [1, 1], 1, [1, 1], 1.5, 1, [1, 1], "hii", 1, [1, 1]],
    "Brightest Beam": [0, 2, [1, 1], 3, [1, 1], 0, 2, [1, 1], "hii", 4, [1, 1]],
    "Cinematic Streak": [110, "None", [1, 1], 1, [0.69, 0.69], 0, 3, [0.69, 0.69], "yo", 2, [0.69, 0.69]],
    "Lavish Laser": [-150, 1, [1.69, 0.69], 2, [1.5, 1], 1.5, 1, [1, 1], "hi", "None", [1, 1]],
    "Full Flashlight": [40, 1, [1, 1], 1, [1, 1], 1, 1, [1, 1], "hiii", 3, [1, 1]]
};

document.getElementById("preset").style.width = "150px";
for (presetname in presets) {
    var optionelem = document.createElement("option");
    optionelem.innerText = presetname;
    document.getElementById("preset").appendChild(optionelem);
}
document.getElementById("preset").addEventListener("input", function() { setPreset.apply(null, presets[this.value]); });

//check if data sent via postmessage
window.addEventListener("message", function(e) {
    if (typeof(e.data) == "object") {
        document.getElementById("flarex").value = e.data.pos[0];
        document.getElementById("flarey").value = e.data.pos[1];
        setPreset.apply(null, e.data.config);
        window.parent.postMessage(canvas.toDataURL("image/png")); //send back URL
    }
    else if (typeof(e.data) == "string" && !repeat) { // fire event when image is added to Photopea canvas
        repeat = true; // prevent repeat
        window.parent.postMessage("app.activeDocument.activeLayer.blendMode = 'lddg'", "*");
    }
});

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

var repeat = true;
//send to photopea
function photopea_build() {
    var x = "app.open('%s', null, true);".replace("%s", canvas.toDataURL("image/png"));
    window.parent.postMessage(x, "*");
    repeat = false;
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
    var photopea_button = document.createElement("button");
    photopea_button.innerText = "Add to document (Photopea)";
    document.getElementById("optionspannel").appendChild(photopea_button);
    photopea_button.onclick = photopea_build;
}

//update preview
for (inputbox of document.querySelectorAll("select, input[type=number], input[type=range], input[type=text]")) {
    inputbox.addEventListener("input", draw);
}
//export overlay
document.getElementsByTagName("button")[0].onclick = download;
draw();