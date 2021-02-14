function addArtifact(canvasContext, imgsrc, centerx, centery, width, height) {
    var image = new Image();
    image.src = imgsrc;
    //position by centerpoint
    var x = centerx - width/2;
    var y = centery - height/2;
    canvasContext.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function lensflare(canvas, hue, flarecenter, hotspottype, streaktype, iristype, halotype, hotspotscale, streakscale, irisscale, haloscale, streakbalance, seed) {
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "lighter";

    /*//set filters
    ctx.filter = "hue-rotate(" + hue + "deg)";*/ //performance too low

    //clear old drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //add elements
    if (streaktype != "None") {
        addArtifact(ctx, "textures/streakleft" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth + (flarecenter[0] - docWidth / 2) * streakbalance) / 1.25 * streakscale[0], docHeight / 6 * streakscale[1]);
        addArtifact(ctx, "textures/streakright" + streaktype + ".png", flarecenter[0], flarecenter[1], (docWidth - (flarecenter[0] - docWidth / 2) * streakbalance) / 1.25 * streakscale[0], docHeight / 6 * streakscale[1]);
    }
    if (hotspottype != "None") {
        addArtifact(ctx, "textures/hotspot" + hotspottype + ".png", flarecenter[0], flarecenter[1], docHeight / 3 * hotspotscale[0], docHeight / 3 * hotspotscale[1]);
    }
    if (halotype != "None") {
        addArtifact(ctx, "textures/halo" + halotype + ".png", flarecenter[0], flarecenter[1], docHeight / 2 * haloscale[0], docHeight / 2 * haloscale[1]);
    }
    if (iristype != "None") {
        Math.seedrandom(seed);

        // multi-iris towards camera
        var currentx = flarecenter[0];
        var currenty = flarecenter[1];
        for (i = 0; i < 55; i++) {
            currentx += (docWidth / 2 - flarecenter[0]) / 20;
            currenty += (docHeight / 2 - flarecenter[1]) / 20;
            if (Math.random() < 0.35) {
                var sclFac = Math.random() * (i / 60);
                ctx.globalAlpha = Math.random() / 2;
                addArtifact(ctx, "textures/iris" + iristype + ".png", currentx, currenty, docHeight / 2 * sclFac * irisscale[0], docHeight / 2 * sclFac * irisscale[1]);
                ctx.globalAlpha = 1;
            }
        }

        // multi-iris away from camera
        var currentx = flarecenter[0];
        var currenty = flarecenter[1];
        for (i = 0; i < 25; i++) {
            currentx -= (docWidth / 2 - flarecenter[0]) / 20;
            currenty -= (docHeight / 2 - flarecenter[1]) / 20;
            if (Math.random() < 0.35) {
                var sclFac = Math.random() * (i / 60);
                ctx.globalAlpha = Math.random() / 2;
                addArtifact(ctx, "textures/iris" + iristype + ".png", currentx, currenty, docHeight / 2 * sclFac * irisscale[0], docHeight / 2 * sclFac * irisscale[1]);
                ctx.globalAlpha = 1;
            }
        }
    }

    //recolor
    ctx.globalCompositeOperation = "hue";
    ctx.fillStyle = "hsl(" + hue.toString() + ", 100%, 50%)"; // would rather use hsv but can't :(
    ctx.fillRect(0, 0, docWidth, docHeight);
    ctx.globalCompositeOperation = "lighter";
}