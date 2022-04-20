let tableSpectral;
let tablePrediction;
let spectralData = [];
let predictionData = [];
let model;

let state = " ";

function preload() {
  tableSpectral = loadTable("trainingSet2.csv", "csv", "header");
  tablePrediction = loadTable("testSet2.csv", "csv", "header");
  spectralData = tableSpectral.getRows();
  predictionData = tablePrediction.getRows();
}

function setup() {
  let options = {
    inputs: ["sm_5cm","sm_20cm", "sm_60cm"],
    // IMPORTANT !
    //output needs to be formatted as a string in .csv file
    outputs: ["Month"],
    task: "classification",
    debug: "true",
  };

  model = ml5.neuralNetwork(options);
  inputDataPoints(spectralData);
}

function keyPressed() {
  if (key == "t") {
    state = "training";

    let options = {
      epochs: 50
    };

    model.train(options, finishedTraining);
  } else if (key == "p" && state == "prediction") {
    console.log("predict data:");
    inputPredictionPoints(predictionData);
  }
}

function finishedTraining() {
  console.log("finished training.");
  state = "prediction";
}

async function inputDataPoints(dataPoints) {
  for (let i = 0; i < tableSpectral.getRowCount(); i++) {
    let inputs = {
      //key has to be the same as the name of the input in the .csv file
      sm_5cm: dataPoints[i].getNum("sm_5cm"),
      sm_20cm: dataPoints[i].getNum("sm_20cm"),
      sm_60cm: dataPoints[i].getNum("sm_60cm")
    };

    let target = {
      month: dataPoints[i].getString("Month"),
    };

    await model.addData(inputs, target);
    console.log("added datapoints");
  }
  model.normalizeData();
  console.log("data normalized");
}

function inputPredictionPoints(predictionPoints) {
  for (let i = 0; i < tablePrediction.getRowCount(); i++) {
    //key has to be the same as the name of the input in the .csv file
    let inputs = {
      sm_5cm: predictionPoints[i].getNum("sm_5cm") ,
      sm_20cm: predictionPoints[i].getNum("sm_20cm"),
      sm_60cm: predictionPoints[i].getNum("sm_60cm"),
    };
    console.log("added predictionPoints");
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  let label = results[0].label;
  console.log(label);
}
