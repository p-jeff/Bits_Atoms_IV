let clownImage;

function preload() {
  clownImage = loadImage("clown.jpeg");
}

function setup() {
  createCanvas(clownImage.width, clownImage.height);
  rectMode(CENTER);

}

function draw() {

  
  // load the pixels array
  clownImage.loadPixels();

 // index into image pixel array
  for (let y = 0; y < clownImage.height; y++) {
    for (let x = 0; x < clownImage.width; x++) {
      const c = getRGBA(clownImage, x, y) 
      fill(c[0], c[1], c[2]);
    }
  }
  
  image(clownImage, 0, 0); 
  rect(mouseX, mouseY, 40, 40);
}
 
function getRGBA(img, x, y) {
  let i = (mouseX + mouseY * img.width) * 4;
  return [
    img.pixels[i],      //R
    img.pixels[i + 1],  //G
    img.pixels[i + 2],  //B
    img.pixels[i + 3],  //A
  ];
}