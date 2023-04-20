let tolerance = 6;
let colorToMatch;
let video;
let isLoaded = false;
let xAvg = 0, yAvg =0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // an initial color to look for
  colorToMatch = color(255,255,255);

  //video extract taken from https://www.youtube.com/watch?v=uTwy7wZyiaM
  video = createVideo("insects.mp4", videoLoaded);
  video.hide();
}

function videoLoaded() {
    isLoaded = true;
    video.volume(0);
    video.loop();
    video.size(video.elt.width/2, video.elt.height/2);
  }
  

function draw() { 
  image(video, 0,0);

  // get the first matching pixel in the image
  let firstPx = findColor(video, colorToMatch, tolerance);
  
  // if we got a result, draw a circle in that location
  if (firstPx !== undefined) {
    fill(colorToMatch);
    stroke(255);
    strokeWeight(2);
    circle(firstPx[0], firstPx[1], 30);
  }
}


// use the mouse to select a color to track
function mousePressed() {
  loadPixels();
  colorToMatch = get(mouseX, mouseY);
}


// find the first instance of a color in an image and return the location
function findColor(input, c, tolerance) {
  if (isLoaded) {
 
  // grab rgb from color to match
  let matchR = c[0];
  let matchG = c[1];
  let matchB = c[2];


  input.loadPixels();
  for (let y=0; y<input.height; y++) {
    for (let x=0; x<input.width; x++) {
 
      // current pixel color
      let index = (y * video.width + x) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index+1];
      let b = video.pixels[index+2];

        // if our color detection has no wiggle-room 
        //then it won't work very well in real-world conditions 
        //to overcome this, check if the rgb values are within a certain range

      if (r >= matchR-tolerance && r <= matchR+tolerance &&
          g >= matchG-tolerance && g <= matchG+tolerance &&
          b >= matchB-tolerance && b <= matchB+tolerance) {

          //YOUR CODE HERE
          //push x,y to the array

          //shift the array once the're more than 20 elements. You can experiment
          //with this value, to see when the smoothing works best

          //sum all x, and y coordinates


          //divide x and y by the total amount of elements inside of your array
          //to get the average coordinate
    

        
          //return the averaged x and y
          return [x,y];
        }
      }
    }
  }

  // if no match was found, return 'undefined'
  return undefined;
}

