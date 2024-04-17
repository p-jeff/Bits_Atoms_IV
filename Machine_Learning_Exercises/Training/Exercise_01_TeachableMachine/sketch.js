let video;
let label = " ";
let confidence = 0.0;
let classifier;
let x = 0;
let y = 200;

//change this to your model
// train a new model here: https://teachablemachine.withgoogle.com/
let modelURL = "https://teachablemachine.withgoogle.com/models/nUPPNMXV4/"
let cropedVideo;

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

let x = 0;
let y = 0;

function setup() {
  createCanvas(640, 480);
  textAlign(CENTER, CENTER);
  fill(255, 255, 0);
  textSize(14);
  video = createCapture(VIDEO)
  video.size(video.width, video.height);
  video.hide();
  cropedVideo = createGraphics(video.height, video.height)
  cropedVideo.background(0);
  classifyVideo();
  x = width / 2;
  y = height / 2;
}

function draw() {
  background(100);
  // show image
  image(cropedVideo, 0, 0);
  //show label for prediction with highest probability
  text(label + " " + confidence + "%", cropedVideo.width/2, cropedVideo.height + 20);

  if(label == "Hat On"){
    x++;
  } else if (label == "Hat Off"){
    x--;
  }
  rect(x,y, 100, 100)
}


  function classifyVideo() {
    let flippedVideo;
    flippedVideo = ml5.flipImage(video)
    try {
      // crop the image to match the format of teachablemachine
      let xOffest = (flippedVideo.width - flippedVideo.height) / 2;
      cropedVideo.image(flippedVideo, -xOffest, 0, flippedVideo.width, flippedVideo.height);
      // classify image
      classifier.classify(cropedVideo, gotResults);
    } catch (e) {
      console.log(e);
    }
  }

  function gotResults(error, results) {
    if (error) {
      console.error(error);
      return;
    }
    // find classification with highest confidence
    confidence = 0.0;
    label = "none";
    for (let i = 0; i < results.length; i++) {
      let iconfidence = floor(results[i].confidence * 100); // convert decimal to percentage with no decimal places
      if (iconfidence > confidence) {
        confidence = iconfidence
        label = results[i].label;
      }

    }
    classifyVideo();
  }
