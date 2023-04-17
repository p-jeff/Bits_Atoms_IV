
let tableTraining;
let tablePrediction;
let model;
let counter = 0;
let inputMin, inputMax, outputMin, outputMax;
let inputs = [];
let outputs = [];
let state = " ";


const options = {
  //soil moisture at 5cm
  inputs: ['sm_5cm'],
  outputs: ['sm_20cm'],
  task: 'regression',
  debug: true,
  learningRate: 0.2,
};

function preload() {
  tableTraining = loadTable("trainingSet.csv", "csv", "header");
  tablePrediction = loadTable("testSet.csv", "csv", "header");
  trainingData = tableTraining.getRows();
  predictionData = tablePrediction.getRows();
}


function setup() {
  createCanvas(500, 500);
  background(225);
  noStroke();

  model = ml5.neuralNetwork(options);
  inputDataPoints(trainingData);
 
}

async function inputDataPoints(dataPoints) {
  for (let i = 0; i < tableTraining.getRowCount(); i++) {
    let input = {
      sm_5cm: dataPoints[i].getNum("sm_5cm")
    };
    let target = {
      sm_20cm: dataPoints[i].getNum("sm_20cm")
    };
    await model.addData(input, target);
    console.log("added datapoints");
  }
  model.normalizeData();
  console.log("data normalized");
  
}

function keyPressed() {
  if (key == "t") {
    state = "training";
   
    model.data.data.raw.forEach(row => {
      let x = map(row.xs.sm_5cm, model.data.data.inputMin, model.data.data.inputMax, 0, width);
      let y = map(row.ys.sm_20cm, model.data.data.outputMin, model.data.data.outputMax, height, 0);
      fill(0)
      circle(x, y, 2);
  })

  const trainingOptions = {
    epochs: 5,
    batchSize: 8
  }

  model.train(trainingOptions, finishedTraining)

  } else if (key == "p" && state == "prediction") {
    inputPredictionPoints();
    predict()
  }
}

function finishedTraining() {
  console.log("finished training.");
  state = "prediction";
}

function inputPredictionPoints() {
  inputMin = Infinity;
  inputMax = -Infinity;
  outputMin = Infinity;
  outputMax = -Infinity;

  for (let r = 0; r < predictionData.length; r++) {
    inputMin = min(inputMin, predictionData[r].getNum("sm_5cm"));
    inputMax = max(inputMax, predictionData[r].getNum("sm_5cm"));
    outputMin = min(outputMin, predictionData[r].getNum("sm_20cm"))
    outputMax = max(outputMax, predictionData[r].getNum("sm_20cm"))
  }
}

function predict() {
  if (counter < tablePrediction.getRowCount()) {
    let input = predictionData[counter].getNum("sm_5cm");
      
   model.predict([input], (err, result) => {
    if(result){
     console.log(result);
     console.log(`Predicted value:${result[0].value}`) 
    }
    if (err) {
      console.log(err);
      return;
    }

    const x = map(input, inputMin, inputMax, 0, width);
    const y = map(result[0].value, outputMin, outputMax, height, 0);
   
    fill(255, 0, 0);
    circle(x, y, 6);
    counter++;
    predict()
  });
 }
}