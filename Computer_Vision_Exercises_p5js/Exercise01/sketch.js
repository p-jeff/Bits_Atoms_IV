let maxBrX = 0; //the x posiiton of the brightest pixel
let maxBrY = 0; // the y position of the brightest pixel
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

  //YOUR CODE COMES HERE ;)
  // loop through image to find the brightest pixel
  

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
