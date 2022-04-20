let camera;
let colorTarget;

function setup() {
  
  createCanvas(640, 480);
  camera = createCapture(VIDEO);
  camera.size(width, height);
  camera.hide();

  pixelDensity(1);
}

function draw() {

  image(camera, 0, 0);

  if (colorTarget) {
    let loc = closestPixel(colorTarget);
    fill(colorTarget);
    ellipse(loc[0], loc[1], 50, 50);
  }
}

function mousePressed() {
  colorTarget = get(mouseX, mouseY);
  print(colorTarget);
}

function keyPressed() {
  colorTarget = undefined;
}

// return a 2 element array with closest pixel to colorTarget colour
function closestPixel(target) {

  let best = 255 * 255 * 255;
  let bestLoc = [0, 0];

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = (x + y * width) * 4;

      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];

      let d = dist(red(target), green(target), blue(target), r, g, b);

      if (d < best) {
        best = d;
        bestLoc = [x, y];
      }
    }
  }
  return bestLoc;
}
