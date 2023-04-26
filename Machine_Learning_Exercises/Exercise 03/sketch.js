let tableTelemetry;
let telemetryData = [];
let model;
let e = 3;
let state = " ";
let angle = 0;
let label;

function preload() {
  tableTelemetry = loadTable("iris.csv", "csv", "header");
  telemetryData = tableTelemetry.getRows();
}

function setup() {
  createCanvas(500,500)
  let options = {
    //IMPORTANT !
    //your inputs have to have the same name as the column names in your .csv data
    inputs: ["sepal_length", "sepal_width", "petal_length", "petal_width"],
   
    //output needs to be formatted as a string in .csv file
    //In this case it's either Iris-setosa, Iris-virginica, Iris-versicolor,
    outputs: ["species"],
    task: "classification",

    //show training window
    debug: "true",
  };


  model = ml5.neuralNetwork(options);
  inputDataPoints(telemetryData);

  textSize(32)
  trainButton = createButton("Train")
  trainButton.position(10,490)
  trainButton.mousePressed(trainModel);


  sepalWidth = createInput("4.5")
  sepalWidth.position(10, 10);
  sepalWidth.size(100);
  sW = createP('Sepal Width: Floating value Between 4 and 8');
  sW.position(120, -5);
  
  
  sepalLength = createInput("2.2")
  sepalLength.position(10, 40);
  sepalLength.size(100);
  sL = createP('Sepal Length: Floating value Between 2 and 5');
  sL.position(120, 25);

  petalWidth = createInput("5.4")
  petalWidth.position(10, 70);
  petalWidth.size(100);
  pW = createP('Petal Width: Floating value Between 1 and 7');
  pW.position(120, 55);
  
  petalLength = createInput("1.7")
  petalLength.position(10, 100);
  petalLength.size(100);
  pL = createP('Petal Length: Floating value Between 0.1 and 2.5');
  pL.position(120, 85);

  predictButton = createButton("Predict")
  predictButton.position(10,130)
  predictButton.mousePressed(predictModel);


}

function draw() {
  background(255)
 
  push()
  translate(180,350)  
  for(var i=0; i<= e; i++){
    //use (1,0) or (-1,0) instead of (0,0) as starting point to close the figure
    bezier(1,0,-47,-80,-47,-120,0,-175); 
    bezier(0,-175,47,-120,47,-80,-1,0);
    rotate(2*PI/e);
  }
  pop()

  text(label, 100 , 495)
}

function trainModel() {
  state = "training";

  let options = {
    epochs: 20,
    batchSize: 16
  };

  model.train(options, finishedTraining);

}

function predictModel() {
  if(state == "prediction"){
    let inputs = {
      //key has to be the same as the name of the input in the .csv file
      sepal_length: sepalLength.value(),
      sepal_width:  sepalWidth.value(),
      petal_length: petalLength.value(),
      petal_width:  petalWidth.value(),
    };
    model.classify(inputs, gotResults)
   
  }else {
    console.log("still training")
  }
  
}


function finishedTraining() {
  console.log("finished training.");
  state = "prediction";
}

async function inputDataPoints(dataPoints) {
  for (let i = 0; i < tableTelemetry.getRowCount(); i++) {
    let inputs = {
      //key has to be the same as the name of the input in the .csv file
      sepal_length: dataPoints[i].getNum("sepal_length"),
      sepal_width:  dataPoints[i].getNum("sepal_width"),
      petal_length: dataPoints[i].getNum("petal_length"),
      petal_width:  dataPoints[i].getNum("petal_width"),
    };
    //same for the target
    let target = {
      species: dataPoints[i].getString("species"),
    };

    await model.addData(inputs, target);
    console.log("added datapoints");
  }
  model.normalizeData();
  console.log("data normalized");
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  console.log(label);
}
