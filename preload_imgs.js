var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
        images[i].style.position = "fixed";
        images[i].style.top, images[i].style.left = "-1000vmax";
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
    "textures/streakleft1.png",
    "textures/streakright1.png",
    "textures/hotspot1.png",
    "textures/iris1.png",
    "textures/halo1.png",
    "textures/streakleft2.png",
    "textures/streakright2.png",
    "textures/iris2.png",
    "textures/halo2.png",
    "textures/halo3.png"
)
