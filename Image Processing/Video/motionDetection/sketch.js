let cam;
let scaler = 2;
let motionImage;


function setup() {
  createCanvas(640,480);
  pixelDensity(1);
  let constraints = {
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 480
      },
    },
    audio: false
  };
  cam = createCapture(constraints);
  cam.size(width / scaler, height / scaler);
  cam.hide();
  
  motionImage = createImage(cam.width, cam.height);
}

function draw() {

  cam.loadPixels();
  motionImage.loadPixels();

  for (let y = 0; y < cam.height; y++) {
    for (let x = 0; x < cam.width; x++) {
      var index = (x + y * cam.width) * 4
      let mr = motionImage.pixels[index + 0];
      let mg = motionImage.pixels[index + 1];
      let mb = motionImage.pixels[index + 2];

      let r = cam.pixels[index + 0];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];
      let bright = (r + g + b) / 3;
			
      var diff = dist(r, g, b, mr, mg, mb);

			if (diff < 20){
        fill(bright);
      } else {
        fill(255);
      }
      noStroke();
      rect(x * scaler, y * scaler, scaler, scaler);
    }
  }

  motionImage.copy(cam, 0, 0, cam.width, cam.height, 0, 0, cam.width, cam.height);

}