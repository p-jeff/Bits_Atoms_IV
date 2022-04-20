
var camScale = 16;
var cols, rows;
var cam;

function setup() {
  createCanvas(640, 480);
  cols = width/camScale;
  rows = height/camScale;

  pixelDensity(1);
  cam = createCapture(cam);
  cam.size(cols, rows);
  cam.hide();
}

function draw() {
  cam.loadPixels();

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      var loc = (i + j * cols) * 4;
      
      var r = cam.pixels[loc   ]; 
      var g = cam.pixels[loc + 1];
      var b = cam.pixels[loc + 2];
      fill(r,g,b);
      stroke(0);
     
      var x = i*camScale;
      var y = j*camScale;
      rect(x, y, camScale, camScale);
    }
  }
}

