let camera;

function setup() {
  createCanvas(640, 480);
  background(0)

  // start video capture
  camera = createCapture(VIDEO);
  camera.size(width, height); 
  camera.hide();
  
  pixelDensity(1);
}

function draw() {
  //draw mirrorred
  push();
  scale(-1, 1);
  image(camera, -camera.width, 0, camera.width, camera.height);
  pop();

  loc = brightestPixel();
  fill(255, 200);
  ellipse(loc[0], loc[1], 50, 50);

}


// return a 2 element array with brightest pixel
function brightestPixel() {

  let brightest = 0;
  let brightestLoc = [0, 0];

  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = (x + y * width) * 4;

      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let bright = brightness(color(r, g, b));

      if (bright > brightest) {
        brightest = bright;
        brightestLoc = [x, y];
      }
    }
  }
  return brightestLoc;
}
