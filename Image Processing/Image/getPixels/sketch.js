let zhdkImage;

function preload() {
  zhdkImage = loadImage("zhdk.jpg");
}

function setup() {
  createCanvas(300, 300);
  
}

function draw() {
  background(0);

  zhdkImage.loadPixels();

  for (let y = 0; y < zhdkImage.height; y++) {
    for (let x = 0; x < zhdkImage.width; x++) {
      const in_color = zhdkImage.get(x, y);

      const r = red(in_color);

      let out_color;
      if (r === 255) {
        out_color = color(255, 0, 0);
      } else {
        out_color = color(0, 0, 255);
      }

      zhdkImage.set(x, y, out_color);
    }
  }

  zhdkImage.updatePixels();

  noSmooth();
  image(zhdkImage, 0, 0, width, height);

  noLoop();
  
}