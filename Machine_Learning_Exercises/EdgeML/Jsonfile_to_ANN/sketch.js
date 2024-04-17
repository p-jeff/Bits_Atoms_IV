// see https://blog.tensorflow.org/2019/11/how-to-get-started-with-machine.html for an alternative approach 

let trainingFinished = false;
let nnResults;

// Step 1: load data or create some data 
let data = [];
let inputs;
let json;


// Step 2: set your neural network options
const options = {
  task: 'classification', // or 'regression'
  inputs: ['co2', 'tvoc', 'temp', 'altitude', 'humidity'],
  outputs: ['label'],
  debug: true,
  learningRate: 0.1,
  hiddenUnits: 24,
}

// Step 3: initialize your neural network
const nn = ml5.neuralNetwork(options);

// Step 4: add data to the neural network

function preload() {
  // Load the training data
  json = loadJSON("trainingData.json");
}

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
}

function saveData() {
  nn.save()
}



function setup() {
  setupSerial()
  createCanvas(800, 800);
  fill(255);
  textSize(12);
  // convert from object to array
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
      var val = json[key];
      data.push(val)
      console.log(val)
    }
  }


  data.forEach(item => {
    const inputs = {
      co2: item.co2,
      tvoc: item.tvoc,
      temp: item.temp,
      altitude: item.altitude,
      humidity: item.humidity
    };
    const output = {
      label: item.label
    };
    nn.addData(inputs, output);
  });

  // Step 5: normalize your data;
  nn.normalizeData();

  // Step 6: train your neural network
  const trainingOptions = {
    epochs: 120,
    batchSize: 8
  }

  nn.train(trainingOptions, finishedTraining);

}

function draw() {
  background(0, 0, 0)
  checkConnection();
  classifyData();
  if (nnResults) {
    let offset = 0;
    for (val of nnResults) {
      text(val.label + " :" + val.confidence, 10, 10 + offset);
      offset += 15;
    }

  }
}

function classifyData() {
  if (trainingFinished && isConnected) {
    if (serialData) {
      const input = {
        co2: serialData.co2,
        tvoc: serialData.tvoc,
        temp: serialData.temp,
        altitude: serialData.altitude,
        humidity: serialData.humidity,
      }
      classify(input);
    }
  }
}
