let handpose;
let video;
let hands = [];

fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20]
};  // for rendering each finger as a polyline

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", results => {
    hands = results;
    console.log(hands);
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);
  console.log(hands)
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    for (let j = 0; j < hand.landmarks.length; j += 1) {
      const keypoint = hand.landmarks[j];
      fill(255, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
      text(j, keypoint[0] + 5, keypoint[1])
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    for (const [key, list] of Object.entries(fingerLookupIndices)) {
      // key
      // draw each finger
      for (let j = 1; j < list.length; j++) {
        let indexA = list[j - 1];
        let indexB = list[j];
        let partA = hand.landmarks[indexA];
        let partB = hand.landmarks[indexB];
        stroke(255, 255, 0);
        line(partA[0], partA[1], partB[0], partB[1]);
      }
    }
  }
}
