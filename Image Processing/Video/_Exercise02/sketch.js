let video;
let isLoaded = false;
let r = 0,g = 0,b = 0;

function videoLoaded() {
  isLoaded = true;
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  let constraints = {
    video: {
      minWidth: 640,
      minHeight: 480,
      deviceId: "d089e9a44c05846d9f21121e9cd86c573c568323b27aa65d8d3bf0c450d4d914",
    },
    audio: false,
  };

  video = createCapture(constraints, videoLoaded);
  video.hide();
}

function draw() {
  if (isLoaded) {

    video.loadPixels();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {

        let index = (y * width + x) * 4;

        r += video.pixels[index + 0];
        g += video.pixels[index + 1];
        b += video.pixels[index + 2];

      }
    }
    video.updatePixels();

    r /= video.width * video.height;
    g /= video.width * video.height;
    b /= video.width * video.height;
    
    let bright = brightness(color(r, g, b));
    bright = map(bright, 0, 255, 30, 300);
    image(video, 0, 0);

    noStroke();
    fill(r, g, b);
    circle(width/2, height/2, bright);
  }
}