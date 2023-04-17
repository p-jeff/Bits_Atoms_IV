let video;
let isLoaded = false;
let r = 0,g = 0,b = 0;


function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  let constraints = {
    video: {
      minWidth: 640,
      minHeight: 480,
    },
    audio: false,
  };

  video = createCapture(constraints, videoLoaded);
  video.hide();
}

function videoLoaded() {
  isLoaded = true;
}

function draw() {
  if (isLoaded) {
    image(video, 0, 0);
    video.loadPixels();

    //loop through video pixels 
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let index = (y * width + x) * 4;

        //create a total sum or r,g,b values
        r += video.pixels[index + 0];
        g += video.pixels[index + 1];
        b += video.pixels[index + 2];

      }
    }
 
    //calculate the average of r, g, and b values


    //calculate the brightest color
   

    //draw circle using the brightest color as a diameter
 
  }
}