let trainingFinished = false;
let nnResults;

// Step 1: load data or create some data 
const data = [
  { r: 255, g: 0, b: 0, color: 'red-ish' },
  { r: 254, g: 0, b: 0, color: 'red-ish' },
  { r: 253, g: 0, b: 0, color: 'red-ish' },
  { r: 0, g: 255, b: 0, color: 'green-ish' },
  { r: 0, g: 254, b: 0, color: 'green-ish' },
  { r: 0, g: 253, b: 0, color: 'green-ish' },
  { r: 0, g: 220, b: 0, color: 'green-ish' },
  { r: 0, g: 255, b: 255, color: 'aqua' },
  { r: 0, g: 250, b: 255, color: 'aqua' },
  { r: 255, g: 250, b: 0, color: 'yellow' },
  { r: 250, g: 245, b: 0, color: 'yellow' },
  { r: 245, g: 250, b: 0, color: 'yellow' },
  { r: 0, g: 0, b: 255, color: 'blue-ish' },
  { r: 0, g: 0, b: 230, color: 'blue-ish' },
  { r: 0, g: 0, b: 254, color: 'blue-ish' },
];

// Step 2: set your neural network options
const options = {
  task: 'classification', // or 'regression'
  inputs: ['r', 'g', 'b'],
  outputs: ['color'],
  debug: true,
  learningRate: 0.2,
  hiddenUnits: 16,
}

// Step 3: initialize your neural network
const nn = ml5.neuralNetwork(options);

console.log(data);

// Step 4: add data to the neural network
data.forEach(item => {
  const inputs = {
    r: item.r,
    g: item.g,
    b: item.b
  };
  const output = {
    color: item.color
  };
  nn.addData(inputs, output);
});

// Step 5: normalize your data;
nn.normalizeData();

// Step 6: train your neural network
const trainingOptions = {
  epochs: 120,
  batchSize: 12
}

nn.train(trainingOptions, finishedTraining);

// Step 7: use the trained model
function finishedTraining() {
  trainingFinished = true;
}

// Step 8: make a classification
function classify(input) {
  nn.classify(input, handleResults);
}

// Step 9: define a function to handle the results of your classification
function handleResults(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  nnResults = result
  //console.log(result); // {label: 'red', confidence: 0.8};
}

let img

function setup() {
  createCanvas(800, 800);
  fill(255);
  textSize(12);
  img = loadImage('spectrum.png');
}

function draw() {
  image(img, 0, 0, width, height);
  classifyPixelColor();
}

function classifyPixelColor() {
  if (trainingFinished) {
    // Get the color of a pixel.
    let c = get(mouseX, mouseY);
    // format the color 
    if (c) {
      const input = {
        r: c[0],
        g: c[1],
        b: c[2]
      }
      classify(input);
      drawLabel(nnResults, input);
    }
  }
}
function drawLabel(result, input) {
  if (result) {
    let offset = 0;
  for (val of result) {
    text(val.label +" :" + val.confidence, mouseX+10, mouseY+offset);
    offset += 15;
  }
  text(input.r+" "+input.g+" "+input.b, mouseX+10, mouseY+offset)
  }
}

