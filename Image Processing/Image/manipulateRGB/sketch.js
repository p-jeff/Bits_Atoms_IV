let zhdkImage;

function preload() {
  zhdkImage = loadImage("zhdk.jpg");
  
}  

function setup() {
  createCanvas(600, 600);
  background(0);
  zhdkImage.resize(600,600);
  noLoop();
}

function draw() {

  // set drawing styles

 

  zhdkImage.loadPixels();

  for (let x = 0; x < zhdkImage.width; x++) {
    for (let y = 0; y < zhdkImage.height; y++) {
      const pixelRed = getRGBA(zhdkImage, x, y)[0];
      stroke(0, random(255), 50, 100);
      // pick a random value and compare it pixelRed
      // for example:
      // if pixelRed is 0, we'll never draw
      // if pixelRed is 255, we'll always draw
      // if pixelRed is 127, we'll draw 50% of the time
      if (random(255) < pixelRed) {
        drawGrassBlade(x, y);
      }
    }
  }
  noLoop();
}

function drawGrassBlade(x, y) {
  const bladeHeight = min(
    random(1, 60),
    random(1, 60),
    random(1, 60),
    random(1, 60),
    random(1, 60),
    random(1, 60)
  );

  let bladeLean = random(-0.3, 0.3);
  bladeLean *= bladeHeight;

  line(x, y, x + bladeLean, y - bladeHeight);
}

function getRGBA(img, x, y) {
  const i = (y * img.width + x) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}
