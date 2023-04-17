let maxX = 0;
let maxY = 0;
let maxBrightness = 0;
let moonImage;

function preload() {
  moonImage = loadImage("/moon.jpg");
}

function setup() {
  createCanvas(600, 600);
  background(0);  
}

function draw() {
  // load the pixels array
  moonImage.loadPixels();
  image(moonImage, 0, 0, moonImage.width, moonImage.height);

  // index into image pixel array
  for (let y = 0; y < moonImage.height; y++) {
    for (let x = 0; x < moonImage.width; x++) {
      const c = getRGBA(moonImage, x, y);
      var bright = brightness(c);
      if (bright > maxBrightness) {
        maxBrightness = bright;
        maxX = x;
        maxY = y;  
      }
      
    }
  }

  noFill()
  stroke(255,0,0);
  strokeWeight(2)
  circle(maxX, maxY, 30)

  moonImage.updatePixels();
  noLoop();
}

function getRGBA(img, x, y) {
  let i = (x + y * img.width) * 4;
  return [
    img.pixels[i], //R
    img.pixels[i + 1], //G
    img.pixels[i + 2], //B
   // img.pixels[i + 3], //A
  ];
}
