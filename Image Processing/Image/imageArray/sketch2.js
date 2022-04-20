let clownImage;

function preload() {
  clownImage = loadImage("clown.jpeg");
}

function setup() {
  createCanvas(clownImage.width, clownImage.height);
  rectMode(CENTER);
  noLoop();
  
}

function draw() {

  // load the pixels array
  clownImage.loadPixels();

 // index into image pixel array
  for (let y = 0; y < clownImage.height; y++) {
    for (let x = 0; x < clownImage.width; x++) {
      const c = getRGBA(clownImage, x, y) 
      c[0] = 255 - c[0]; // invert red
      c[1] = 255 - c[1]; // invert green
      c[2] = 255 - c[2]; // invert blue
      // don't touch alpha
      setRGBA(clownImage, x, y, c);
    }
  }
  
  clownImage.updatePixels();
  image(clownImage, 0, 0); 
  noLoop();
 
}
 
function getRGBA(img, x, y) {
  let i = (x + y * img.width) * 4;
  return [
    img.pixels[i],      //R
    img.pixels[i + 1],  //G
    img.pixels[i + 2],  //B
    img.pixels[i + 3],  //A
  ];
}

function setRGBA(img, x, y, c) {
  const i = (x + y * img.width) * 4;

  img.pixels[i + 0] = c[0];
  img.pixels[i + 1] = c[1];
  img.pixels[i + 2] = c[2];
  img.pixels[i + 3] = c[3];
}