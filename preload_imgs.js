var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

preload(
    "streakleft1.png",
    "streakright1.png",
    "hotspot1.png",
    "iris1.png",
    "streakleft2.png",
    "streakright2.png",
    "halo2.png"
)
