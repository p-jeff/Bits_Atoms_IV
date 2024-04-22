let trainingFinished = false;
// let nnResults;
let predictResults;
let sharedMousePos;
let predictionNetwork;

let sketch1 = function (p) {
  let img;
  p.preload = function () {
    img = p.loadImage("spectrum.png");
  };

  p.setup = function () {
    p.createCanvas(800, 800);
    predictionNetwork = ml5.neuralNetwork(predictionOptions);
    addMyData();
    predictionNetwork.normalizeData();
    console.log(predictionNetwork);
    predictionNetwork.train(trainingOptions, finishedTraining2);
  };

  p.draw = function () {
    p.background(0);
    p.image(img, 0, 0, p.width - 20, p.height - 20);
    sharedMousePos = p.createVector(p.mouseX, p.mouseY);
    classifyPixelColor(p);
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
    if (sharedMousePos) {
      p.noFill();
      p.stroke(255); // white circle
      p.ellipse(sharedMousePos.x, sharedMousePos.y, 50, 50);
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
      const input2 = {
        red: 80,
        yellow: 10,
        green: 0,
        blue: 0,
        white: 0,
        aqua: 0,
      };
      // classify(input);
      classify2(input2);
      // drawLabel(nnResults, input, p);
    }
  }
}

// Step 1: load data or create some data
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
    yellow: 1,
    green: 0,
    blue: 0,
    white: 0,
    aqua: 0,
    x: 1,
    y: 0,
  },
  {
    red: 78,
    yellow: 12,
    green: 0,
    blue: 0,
    white: 0,
    aqua: 0,
    x: 10,
    y: 0,
  },
  {
    red: 0,
    yellow: 0,
    green: 80,
    blue: 0,
    white: 0,
    aqua: 1,
    x: 500,
    y: 0,
  },
  {
    red: 0,
    yellow: 0,
    green: 79,
    blue: 0,
    white: 0,
    aqua: 12,
    x: 490,
    y: 0,
  },
];

// Step 2: set your neural network options
const options = {
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
  outputs: ["x", "y"],
  debug: true,
  learningRate: 0.2,
  hiddenUnits: 16,
};

// Step 3: initialize your neural network
// const nn = ml5.neuralNetwork(options);


// Step 4: add data to the neural network
// data.forEach((item) => {
//   const inputs = {
//     r: item.r,
//     g: item.g,
//     b: item.b,
//   };
//   const output = {
//     color: item.color,
//   };
//   nn.addData(inputs, output);
// });

// Step 5: normalize your data;
// nn.normalizeData();

// Step 6: train your neural network
const trainingOptions = {
  epochs: 160,
  batchSize: 12,
};

let trainingCounter = 1;

//nn.train(trainingOptions, finishedTraining);

// Step 7: use the trained model
// function finishedTraining() {
//   console.log("finished training 1");
//   trainingCounter++;
//   if (trainingCounter >= 2) {
//     trainingFinished = true;
//   }
// }

function finishedTraining2() {
  console.log("finished training 2");
  trainingCounter++;

  if (trainingCounter >= 2) {
    trainingFinished = true;
  }
}

// Step 8: make a classification
// function classify(input) {
//   nn.classify(input, handleResults);
// }

function classify2(input) {
  predictionNetwork.predict(input, handleResults2);
}

// Step 9: define a function to handle the results of your classification
// function handleResults(error, result) {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   nnResults = result;
//   //console.log(result); // {label: 'red', confidence: 0.8};
// }

function handleResults2(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  if (result) {
    nnResults2 = result;
    console.log(result);
  } else {
    console.error("Result is undefined or null");
  }
}
function drawLabel(result, input, p, c) {
  if (result) {
    let offset = -150;
    for (val of result) {
      p.text(val.label + " :" + val.confidence, 10, p.height + offset);
      offset += 15;
    }
    p.text(input.r + " " + input.g + " " + input.b, 10, p.height + offset);
    p.text(p.mouseX + " " + p.mouseY, 10, p.height + offset + 15);
  }
}

function addMyData(){
  predictionData.forEach((entry) => {
    const inputData = {
      red: entry.red,
      blue: entry.blue,
      green: entry.green,
      yellow: entry.yellow,
      white: entry.white,
      aqua: entry.aqua,
    };
  
    const outputData = {
      x: entry.x,
    };
  
  
      predictionNetwork.addData(inputData, outputData);
   
  });
}