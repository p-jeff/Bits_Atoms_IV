let cam;
let scaler = 2;
let motionImage;
let rects = [];
let sum = 0;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  let constraints = {
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 480,
      },
      deviceId: d089e9a44c05846d9f21121e9cd86c573c568323b27aa65d8d3bf0c450d4d914,
    },
    audio: false,
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
      var index = (x + y * cam.width) * 4;
      let mr = motionImage.pixels[index + 0];
      let mg = motionImage.pixels[index + 1];
      let mb = motionImage.pixels[index + 2];

      let r = cam.pixels[index + 0];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];
      let bright = (r + g + b) / 3;

      var diff = dist(r, g, b, mr, mg, mb);
      motion = shiftRGB();

      let mRect = new Rect(x * scaler, y * scaler, scaler, scaler);
      rects.push(mRect);

      if (rects.length > scaler) {
        rects.splice(0, rects.length);
      }

      if (diff < 20) {
        fill(bright);
      } else {
        if (motion == "right") {
          fill(0, 0, 255);
        } else {
          fill(255, 0, 0);
        }
      }
      noStroke();
    }
  }

  motionImage.copy(cam, 0, 0, cam.width, cam.height, 0, 0, cam.width, cam.height);
}

//find if majority of rects are in the right half of the screen
//if majority of rects are in the left half of the screen, draw green
//if majority of rects are in the right half of the screen, draw red

function shiftRGB() {
  let right = 0;
  let left = 0;
  for (var i = 0; i < rects.length; i++) {
    if (rects[i].getPosX() > width / 2) {
      right++;
    } else {
      left++;
    }
  }
  if (right > left) {
    return "right";
  } else {
    return "left";
  }
}

class Rect {
  constructor(x, y, height, width) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    rect(this.x, this.y, this.height, this.width);
  }
  getPosX() {
    return this.x;
  }
}
