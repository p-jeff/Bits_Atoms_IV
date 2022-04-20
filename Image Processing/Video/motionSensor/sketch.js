var video;
var prevFrame;
var threshold = 50;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  prevFrame = createImage(video.width, video.height, RGB);
}

function draw() {
  background(255);
  video.loadPixels();
  prevFrame.loadPixels();

  var totalMotion = 0;

  for (var x = 0; x < video.width; x++) {
    for (var y = 0; y < video.height; y++) {
      var loc = (x + y * video.width) * 4;
      
      //previous color
      var r1 = prevFrame.pixels[loc   ]; 
      var g1 = prevFrame.pixels[loc + 1];
      var b1 = prevFrame.pixels[loc + 2];

      // current color
      var r2 = video.pixels[loc   ]; 
      var g2 = video.pixels[loc + 1];
      var b2 = video.pixels[loc + 2];

      // compare colors (previous vs. current)
      var diff = dist(r1, g1, b1, r2, g2, b2);
      totalMotion += diff;
    }
  }

  if (video.canvas) {
    prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
  }
  
  var avgMotion = totalMotion / (video.width * video.height); 

  noStroke();
  fill(0);
  var r = avgMotion * 2;
  ellipse(width/2, height/2, r, r);

}