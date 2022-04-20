let camera;
let chromaTarget;
let threshold = 60;

function setup() {
  createCanvas(640,480);

  camera = createCapture(VIDEO);
  camera.size(width, height);
  camera.hide();
  
  pixelDensity(1);
}

function draw() {
  image(camera, 0, 0);

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = (x + y * width) * 4;

      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];

      if (chromaTarget) {
        let d = dist(red(chromaTarget), green(chromaTarget), blue(chromaTarget), r, g, b);

        if (d < threshold) {
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
        }
      }
    }
  }
  updatePixels();
}

function mousePressed() {
  chromaTarget = get(mouseX, mouseY);
  print(chromaTarget);
}

function keyPressed() {
  chromaTarget = undefined;
}