let trainingFinished = false;
let nnResults;
let nnResults2;
let nnResults3;
let predictResults;
let sharedMousePos;
let predictionNetwork;
let yPredictionNetwork;
let classificationNetwork;
let colorResults;

let trainingCounter = 0;

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

const predictionData = [
  {
    red: 80,
    yellow: 10,
    green: 0,
    blue: 0,
    white: 0,
    aqua: 0,
    x: 1,
    y: 570,
  },
  {
    red: 78,
    yellow: 12,
    green: 0,
    blue: 0,
    white: 0,
    aqua: 0,
    x: 10,
    y: 700,
  },
  {
    red: 0,
    yellow: 0,
    green: 1,
    blue: 90,
    white: 0,
    aqua: 4,
    x: 500,
    y: 600,
  },
  {
    red: 0,
    yellow: 0,
    green: 1,
    blue: 79,
    white: 0,
    aqua: 12,
    x: 490,
    y: 400,
  },
  {
    red: 1.01,
    yellow: 15.37,
    green: 0,
    blue: 70.31,
    white: 15.37,
    aqua: 13.18,
    x: 496,
    y: 511,
  },
  {
    white: 84.19,
    yellow: 10.9,
    green: 0,
    blue: 0.3,
    red: 1.91,
    aqua: 2.6,
    x: 145,
    y: 166,
  },
  {
    red: 95.92,
    white: 2.36,
    blue: 1.44,
    yellow: 0.02,
    aqua: 0,
    green: 0,
    x: 725,
    y: 721,
  },
  {
    white: 21,
    red: 9,
    green: 0,
    blue: 70,
    yellow: 0,
    aqua: 1,
    x: 591,
    y: 593,
  },
  {
    white: 93,
    red: 3,
    green: 0,
    blue: 1,
    yellow: 1,
    aqua: 1,
    x: 622,
    y: 112,
  },
  {
    white: 94,
    red: 2,
    green: 0,
    blue: 1,
    yellow: 3,
    aqua: 1,
    x: 63,
    y: 41,
  },
  {
    white: 74,
    red: 2,
    green: 2,
    blue: 0,
    yellow: 17,
    aqua: 5,
    x: 203,
    y: 233,
  },
  {
    white: 62,
    red: 1,
    green: 5,
    blue: 0,
    yellow: 22,
    aqua: 9,
    x: 233,
    y: 302,
  },
  {
    white: 40,
    red: 1,
    green: 18,
    blue: 0,
    yellow: 24,
    aqua: 17,
    x: 256,
    y: 369,
  },
  {
    white: 8,
    red: 1,
    green: 0,
    blue: 83,
    yellow: 0,
    aqua: 9,
    x: 500,
    y: 592,
  },
  {
    white: 12,
    red: 4,
    green: 1,
    blue: 0,
    yellow: 81,
    aqua: 0,
    x: 115,
    y: 536,
  },
  {
    white: 2,
    red: 0,
    green: 85,
    blue: 0,
    yellow: 9,
    aqua: 4,
    x: 240,
    y: 697,
  },
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
  task: "regression", // or 'regression'
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
    predictionNetwork = ml5.neuralNetwork(predictionOptions);
    yPredictionNetwork = ml5.neuralNetwork(predictionOptions);
    classificationNetwork = ml5.neuralNetwork(classificationOptions);

    addMyData("x", predictionNetwork);
    addMyData("y", yPredictionNetwork);
    addClassificationData();

    classificationNetwork.normalizeData();
    predictionNetwork.normalizeData();
    yPredictionNetwork.normalizeData();

    trainNetworks();
  };

  p.draw = function () {
    p.background(0);
    p.image(img, 0, 0, p.width - 20, p.height - 20);
    sharedMousePos = p.createVector(p.mouseX, p.mouseY);

    classifyPixelColor(p);

    if (trainingFinished) {
      drawLabel(nnResults, p);
    }
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
  };
};

new p5(sketch1, "canvas1Container");
new p5(sketch2, "canvas2Container");

function classifyPixelColor(p) {
  if (trainingFinished) {
    // Get the color of a pixel.
    let c = p.get(p.mouseX, p.mouseY);
    // format the color
    if (c) {
      const input = {
        r: c[0],
        g: c[1],
        b: c[2],
      };
      classify(input);
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

function trainNetworks() {
  predictionNetwork.train(trainingOptions, function () {
    finishedTraining();

    yPredictionNetwork.train(trainingOptions, function () {
      classificationNetwork.train(trainingOptions, finishedTraining);
      finishedTraining();
    });
  });
}

function finishedTraining() {
  trainingCounter++;

  if (trainingCounter >= 3) {
    trainingFinished = true;
  }
}

function classify(input) {
  classificationNetwork.classify(input, callbackClassification);
}

function predict(input) {
  yPredictionNetwork.predict(input, callbackY);
}

// Step 9: define a function to handle the results of your classification
function callbackClassification(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  nnResults = result;

  if (result) {
    const temp = {};
    for (let item of result) {
      temp[item.label] = Math.round(item.confidence * 100);
    }

    colorResults = temp;
    //logColorAndMousePosition();

    predictionNetwork.predict(temp, callbackX);
    yPredictionNetwork.predict(temp, callbackY);
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

function drawLabel(result, p) {
  if (result) {
    let offset = -200;
    for (let i = 0; i < result.length; i++) {
      const val = result[i];
      p.text(val.label + " :" + val.confidence, 10, p.height + offset);
      offset += 15;
    }
    //p.text(input.r + " " + input.g + " " + input.b, 10, p.height + offset);
    p.text(p.mouseX + " " + p.mouseY, 10, p.height + offset + 15);

    if (nnResults2) {
      p.text(
        "X prediction: " + nnResults2[0].value,
        10,
        p.height + offset + 30
      );
    }
    if (nnResults3) {
      p.text(
        "Y prediction: " + nnResults3[0].value,
        10,
        p.height + offset + 45
      );
    }
  }
}

function logColorAndMousePosition() {
  const output = {
    white: colorResults.white,
    red: colorResults.red,
    green: colorResults.green,
    blue: colorResults.blue,
    yellow: colorResults.yellow,
    aqua: colorResults.aqua,
    x: sharedMousePos.x,
    y: sharedMousePos.y,
  };
  console.log(output);
}

function addMyData(axis, network) {
  predictionData.forEach((entry) => {
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
