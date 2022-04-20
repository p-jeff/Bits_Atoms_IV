let video;

// the color to track
let trackColor;
// a dimensional array to store marked pixels
var marks = [];
// the total marked pixels
let total = 0;
// the most top left pixel
let topLeft;
// the most bottom right pixel
let bottomRight;

function setup() {
  createCanvas(640, 480);

  // start video capture
  video = createCapture(VIDEO);
  video.hide();

  // set initial track color to red
  trackColor = color(255, 0, 0);

  // initialize marks array
  for (let x = 0; x < width; x++) {
    marks[x] = [];
    for (let y = 0; y < height; y++) {
      marks[x][y] = false;
    }
  }
}

function draw() {
  // draw video image
  image(video, 0, 0);
  // find track color with treshold
  findBlob(20);
  // load canvas pixels
  loadPixels();

  // draw blob
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // get pixel location
      let loc = x + y * width;

      // make pixel red if marked
      if (marks[x][y]) {
        pixels[loc] = color(255, 0, 0);
      }
    }
  }

  // set canvas pixels
  updatePixels();

  // draw bounding box
  stroke(255, 0, 0);
  noFill();
  rect(
    topLeft.x,
    topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y
  );
}

function mousePressed() {
  // save current pixel under mouse as track color
  let loc = (mouseX + mouseY * video.width) * 4;
  trackColor = pixels[loc];
  console.log(trackColor);
}

function findBlob(threshold) {
  // reset total
  total = 0;

  // prepare point trackers
  let lowestX = width;
  let lowestY = height;
  let highestX = 0;
  let highestY = 0;

  // prepare track color vector
  var trackColorVec = createVector(
    red(trackColor),
    green(trackColor),
    blue(trackColor)
  );

  // go through image pixel by pixel
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // get pixel location
      let i = (x + y * width) * 4;

      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];

      // get vector of pixel color
      let currColorVec = createVector(r, g, b);

      // get distance to track color
      let dist = currColorVec.dist(trackColorVec);

      // reset mark
      marks[x][y] = false;

      // check if distance is below threshold
      if (dist < threshold) {
        // mark pixel
        marks[x][y] = true;
        total++;

        // update point trackers
        if (x < lowestX) lowestX = x;
        if (x > highestX) highestX = x;
        if (y < lowestY) lowestY = y;
        if (y > highestY) highestY = y;
      }
    }
  }

  // save locations
  topLeft = createVector(lowestX, lowestY);
  bottomRight = createVector(highestX, highestY);
}
