var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
        document.body.appendChild(images[i]);
        images[i].onload = function() { this.remove(); };
        if (i == arguments.length - 1) {
            images[i].onload = function() {
                this.remove();
                mainscript = document.createElement("script");
                mainscript.src = "code.js";
                document.body.appendChild(mainscript);
            };
        }
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
