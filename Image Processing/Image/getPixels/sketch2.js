
let zhdkImage;

function preload() {
  zhdkImage = loadImage("zhdk.jpg");
}

function setup() {
  createCanvas(300, 300);
 
}

function draw() {
  background(0, 50, 50);

  fill(200, 50, 50);
  noStroke();

  const spacing = width / zhdkImage.width;
  zhdkImage.loadPixels();

  for (let y = 0; y < zhdkImage.height; y+=3) {
    for (let x = 0; x < zhdkImage.width; x+=3) {
      const in_color = zhdkImage.get(x, y);
      const dot_size = (lightness(in_color) / 255) * 5 ;
      circle(x * spacing, y * spacing ,dot_size);
    }
  }
  noLoop();
}