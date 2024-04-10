let video;
let poseNet;
let poses = [];
let floatingDots = [];
let numFloatingDots = 20;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
  });
  video.hide();

  // Initialize the floating dots at random positions within the canvas
  for (let i = 0; i < numFloatingDots; i++) {
    floatingDots.push({
      x: random(width),
      y: random(height),
      diameter: 20,
      pickedUp: false
    });
  }
}

function draw() {
  image(video, 0, 0, width, height);

  // Check if any floating dots are picked up
  let anyPickedUp = false;
  for (let i = 0; i < floatingDots.length; i++) {
    if (floatingDots[i].pickedUp) {
      anyPickedUp = true;
      break;
    }
  }

  // If none are picked up, render and move all floating dots
  if (!anyPickedUp) {
    for (let i = 0; i < floatingDots.length; i++) {
      let dot = floatingDots[i];
      fill(255, 0, 0);
      ellipse(dot.x, dot.y, dot.diameter);
      dot.x += random(-5, 5);
      dot.y += random(-5, 5);
    }
  }

  // Check if any of the floating dots are close enough to the nose to pick up
  if (poses.length > 0 && !anyPickedUp) {
    const nose = poses[0].pose.keypoints[0];
    for (let i = 0; i < floatingDots.length; i++) {
      let dot = floatingDots[i];
      if (dist(nose.position.x, nose.position.y, dot.x, dot.y) < 30) {
        dot.pickedUp = true;
      }
    }
  }

  // If any floating dot is picked up, render it on the nose
  if (anyPickedUp) {
    const nose = poses[0].pose.keypoints[0];
    for (let i = 0; i < floatingDots.length; i++) {
      let dot = floatingDots[i];
      if (dot.pickedUp) {
        dot.x = nose.position.x;
        dot.y = nose.position.y;
        dot.diameter = 50; // Increase dot size when picked up
        fill(255, 0, 0  )
        ellipse(dot.x, dot.y, dot.diameter);
      }
    }
  }

  // Draw the keypoints and skeletons
 // drawKeypoints();
  //drawSkeleton();
}
 

function modelReady() {
  console.log('Model Loaded');
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.3) {
        fill(255, 255, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        text(j, keypoint.position.x + 5, keypoint.position.y)
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 255, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
