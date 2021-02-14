# Sci Fi Flares
<img src="demoflare.png" />

# Usage
## With a standard editor
In your photo editor (Photoshop, etc.) create guides at the point for the flare center to be. Check the document's dimensions, as well as the X and Y where the guides intersect. Go to <a href="https://yikuansun.github.io/sci-fi-flares/">https://yikuansun.github.io/sci-fi-flares/</a> and edit the information on the right, or choose a preset. If you would like to share a preset, please use a pull request.
## As a Photopea plugin
<a href="https://www.photopea.com#%7B%22environment%22:%7B%22plugins%22:%5B%7B%22name%22:%22Sci-Fi%20Flares%20By%20Yikuan%20Sun%22,%22url%22:%22https://yikuansun.github.io/sci-fi-flares/%22,%22width%22:750,%22height%22:400,%22icon%22:%22https://yikuansun.github.io/sci-fi-flares/icon.png%22%7D%5D%7D%7D">Open this link</a>. Open the plugin using the F icon on the menu on the right. On your Photopea document, use guides to find out the X and Y position where the flare needs to be. Edit the boxes in the plugin; when the preview is statisfying, press "add to document." A new document will be opened; close the popup using the same F icon, then drag the layer in the new document into the previous document.
## API
I don't have a server lol so it's not very good. In HTML, make an iframe with SRC `https://yikuansun.github.io/sci-fi-flares/flare.html?canvaswidth=`whatever`&canvasheight=`whatever. Pass `presetData` (an array of format `[hue, hotspottype, hotspotscale, streaktype, streakscale, streakbalance, iristype, irisscale, seed, halotype, haloscale]`) and `defaultFlareCenter` (an array of format `[x, y]`) and usingAPI (value can just be `yes` ig) into the URL (iframe src). Set a message event listener to recieve data (the data URL of the lens flare overlay) sent from the iframe.
<br /> __Example searchparams for iframe SRC:__
> canvaswidth: `3840` <br />
> canvasheight: `2160` <br />
> presetData: `[0, 2, [1, 1], 3, [1, 1], 0, 2, [1, 1], "hii", 4, [1, 1]]` <br />
> defaultFlareCenter: `[1920, 1080]` <br />
> usingAPI: `yes`