function setup() {
  createCanvas(500, 500);
  img = createImage(100, 100);
  noLoop();
}

function draw() {
  background(0);


  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let c = color(random(255), random(255), random(255));
      img.set(x, y, c);
    }
  }

  img.updatePixels();

  noSmooth();
  image(img, 0, 0, width, height);

}