let nnResults, nnResults2, nnResults3;
let predictionNetwork, yPredictionNetwork, classificationNetwork;

let sharedMousePos;
let colorResults;
let trainButton;
let secondTrainingStarted = false;

//Data for the prediction networks, gets added by the user later
let customData = [];

// Data for the color classification network
const data = [
  { r: 255, g: 0, b: 0, color: "red" },
  { r: 254, g: 0, b: 0, color: "red" },
  { r: 253, g: 0, b: 0, color: "red" },
  { r: 0, g: 255, b: 0, color: "green" },
  { r: 0, g: 254, b: 0, color: "green" },
  { r: 0, g: 253, b: 0, color: "green" },
  { r: 0, g: 220, b: 0, color: "green" },
  { r: 0, g: 255, b: 255, color: "aqua" },
  { r: 0, g: 250, b: 255, color: "aqua" },
  { r: 255, g: 250, b: 0, color: "yellow" },
  { r: 250, g: 245, b: 0, color: "yellow" },
  { r: 245, g: 250, b: 0, color: "yellow" },
  { r: 0, g: 0, b: 255, color: "blue" },
  { r: 0, g: 0, b: 230, color: "blue" },
  { r: 0, g: 0, b: 254, color: "blue" },
  { r: 255, g: 255, b: 255, color: "white" },
  { r: 254, g: 254, b: 254, color: "white" },
  { r: 253, g: 253, b: 253, color: "white" },
];

const classificationOptions = {
  task: "classification", // or 'regression'
  inputs: ["r", "g", "b"],
  outputs: ["color"],
  debug: true,
  learningRate: 0.2,
  hiddenUnits: 16,
};

const predictionOptions = {
  task: "regression",
  inputs: ["red", "yellow", "green", "blue", "white", "aqua"],
  outputs: 1,
  debug: true,
  learningRate: 0.2,
  hiddenUnits: 16,
};

const trainingOptions = {
  epochs: 80,
  batchSize: 12,
};

//  Initialize the Skecthes
let sketch1 = function (p) {
  let img;
  p.preload = function () {
    img = p.loadImage("spectrum.png");
  };

  p.setup = function () {
    p.createCanvas(800, 800);
    trainButton = p.createButton("Train Networks");
    trainButton.mousePressed(trainPredictionNetworks);
    trainButton.position(20, 60);

    // Initialize the neural networks
    predictionNetwork = ml5.neuralNetwork(predictionOptions);
    yPredictionNetwork = ml5.neuralNetwork(predictionOptions);
    classificationNetwork = ml5.neuralNetwork(classificationOptions);

    //Auto start the classification network training
    addClassificationData();
    classificationNetwork.normalizeData();
    classificationNetwork.train(trainingOptions, finishedTraining);
  };

  p.draw = function () {
    p.background(0);
    p.image(img, 0, 0, p.width - 20, p.height - 20);

    sharedMousePos = p.createVector(p.mouseX, p.mouseY);

    // While the Prediction networks are not trained, the user can add data by clicking on the canvas
    if (classificationNetwork.neuralNetwork.isTrained) {
      p.mouseClicked = function () {
        customData.push({
          white: colorResults.white,
          red: colorResults.red,
          green: colorResults.green,
          blue: colorResults.blue,
          yellow: colorResults.yellow,
          aqua: colorResults.aqua,
          x: sharedMousePos.x,
          y: sharedMousePos.y,
        });
        console.log(customData);
      };
      if (!secondTrainingStarted) {
        customData.forEach((data) => {
          p.noFill();
          p.ellipse(data.x, data.y, 10, 10);
        });
      }
    }
    classifyPixelColor(p); // This gets the color of the pixel under the mouse, and then runs it through the classification network to get color predictions

    p.fill(0);
    drawLabel(nnResults, p);
  };
};

let sketch2 = function (p) {
  let img;
  p.preload = function () {
    img = p.loadImage("spectrum.png");
  };

  p.setup = function () {
    p.createCanvas(800, 800);
  };

  p.draw = function () {
    p.background(0);
    p.image(img, 0, 0, p.width - 20, p.height - 20);
    if (nnResults2 && nnResults3) {
      p.noFill();
      p.stroke(0); // white circle
      p.strokeWeight(4);
      p.ellipse(nnResults2[0].value, nnResults3[0].value, 50, 50);
    }

    p.fill(0);
    p.strokeWeight(0.25);
    p.text(
      "Classification Network is trained: " +
        classificationNetwork.neuralNetwork.isTrained,
      10,
      30
    );
    p.text(
      "X Prediction Network is trained: " +
        predictionNetwork.neuralNetwork.isTrained,
      10,
      60
    );
    p.text(
      "Y Prediction Network is trained: " +
        yPredictionNetwork.neuralNetwork.isTrained,
      10,
      90
    );
  };
};

new p5(sketch1, "canvas1Container");
new p5(sketch2, "canvas2Container");

function classifyPixelColor(p) {
  if (classificationNetwork.neuralNetwork.isTrained) {
    // Get the color of a pixel.
    let c = p.get(p.mouseX, p.mouseY);
    // format the color
    if (c) {
      const input = {
        r: c[0],
        g: c[1],
        b: c[2],
      };
      classificationNetwork.classify(input, callbackClassification);
    }
  }
}

function addClassificationData() {
  data.forEach((item) => {
    const inputs = {
      r: item.r,
      g: item.g,
      b: item.b,
    };
    const output = {
      color: item.color,
    };
    classificationNetwork.addData(inputs, output);
  });
}

function addPredictionData(axis, network, data) {
  data.forEach((entry) => {
    const inputData = {
      red: entry.red,
      blue: entry.blue,
      green: entry.green,
      yellow: entry.yellow,
      white: entry.white,
      aqua: entry.aqua,
    };

    if (axis === "x") {
      const outputData = {
        x: entry.x,
      };
      network.addData(inputData, outputData);
    } else if (axis === "y") {
      const outputData = {
        y: entry.y,
      };
      network.addData(inputData, outputData);
    }
  });
}

function trainPredictionNetworks() {
  if (customData.length < 3) {
    console.log("Not enough data to train the networks");
    return;
  } else {
    trainButton.remove();

    secondTrainingStarted = true;
    document.body.classList.add("loading");

    console.log("Starting to Train");
    addPredictionData("x", predictionNetwork, customData);
    addPredictionData("y", yPredictionNetwork, customData);

    predictionNetwork.normalizeData();
    yPredictionNetwork.normalizeData();

    predictionNetwork.train(
      trainingOptions,
      yPredictionNetwork.train(trainingOptions, finishedTraining)
    );
  }
}

// this is just a callback for the training, when the last network is trained, the loading screen is removed
function finishedTraining(error) {
  if (error) {
    console.error(error);
    return;
  }
  if (
    classificationNetwork.neuralNetwork.isTrained &&
    predictionNetwork.neuralNetwork.isTrained &&
    yPredictionNetwork.neuralNetwork.isTrained
  ) {
    document.body.classList.remove("loading");
  }
}

function callbackClassification(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  nnResults = result;

  // Formats the result to the data format of the prediction networks (from 0-1 to 0-100)
  if (result) {
    const temp = {};
    for (let item of result) {
      temp[item.label] = Math.round(item.confidence * 100);
    }
    colorResults = temp;
    if (
      predictionNetwork.neuralNetwork.isTrained &&
      yPredictionNetwork.neuralNetwork.isTrained
    ) {
      predictionNetwork.predict(temp, callbackX);
      yPredictionNetwork.predict(temp, callbackY);
    }
  }
}

function callbackX(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  if (result) {
    nnResults2 = result;
  }
}

function callbackY(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  if (result) {
    nnResults3 = result;
  }
}

// Draw the label
function drawLabel(result, p) {
  if (result) {
    let offset = -125;
    for (let i = 0; i < result.length; i++) {
      const val = result[i];
      p.text(val.label + " :" + val.confidence, 10, p.height + offset);
      offset += 15;
    }
    if (nnResults2) {
      p.text(
        "X prediction: " + nnResults2[0].value,
        10,
        p.height + offset 
      );
    }
    if (nnResults3) {
      p.text(
        "Y prediction: " + nnResults3[0].value,
        10,
        p.height + offset + 15
      );
    }
  }
}


