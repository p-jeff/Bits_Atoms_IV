let video;
let label = " "; 
let confidence = 0.0;
let classifier;

//change this to your model
let modelURL = "https://teachablemachine.withgoogle.com/models/4JjBKn-Xy/"

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
  createCanvas(1280, 720);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
 
  let constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      },
      optional: [{ maxFrameRate: 10 }]
    },
    audio: false
  };

  video = createCapture(constraints)
  video.size(1280, 720);
  video.hide();
  classifyVideo();
}

function draw() {
  background(0);
  image(video, 0, 0);

  //show label if the prediction is more than 90% accurate
  if (confidence > 0.9) {
    text(label + " " + confidence*100 + "%", width/2, height - 16);
  }
}

function classifyVideo() {
  classifier.classify(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  //show resulting label
  label = results[0].label;
  //round float to two decimals
  confidence = nf(results[0].confidence, 0, 2);
  classifyVideo();
}
