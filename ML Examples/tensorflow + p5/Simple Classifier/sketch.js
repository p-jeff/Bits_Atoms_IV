let model;
let xs, ys;
let labelP;

let tableTraining;
let tablePredictions;
let envData = [];
let predictionData = [];
let training = false;

//change this to include your own classification labels
let labelList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let labelsTensor;
let next = 0;

//change this to use your own dataset
function preload() {
  tableTraining = loadTable("trainingSet2.csv", "csv", "header");
  tablePredictions = loadTable("testSet2.csv", "csv", "header");
}

function setup() {
  createCanvas(400,400)
  textSize(16)

  text("Press T to train, Press P to predict", 10, 30);
  labelP = createP();
  labelP.position(20,100)

  let readings = [];
  for (var i = 0; i < tableTraining.getRowCount(); i++) {
    readings = [
      tableTraining.getNum(i, "sm_5cm"),
      tableTraining.getNum(i, "sm_20cm"),
    ];
    envData.push(readings);

    labels = tableTraining.getString(i, "Month");

    switch(labels){
      case "January":
        predictionData.push(1);
        break;
      case "February":
        predictionData.push(2);
        break;
      case "March":
        predictionData.push(3);
        break;
      case "April":
        predictionData.push(4);
        break;
      case "May":
        predictionData.push(5);
        break;
      case "June":
        predictionData.push(6);
        break;
      case "July":
        predictionData.push(7);
        break;
      case "August":
        predictionData.push(8);
        break;
      case "September":
        predictionData.push(9);
        break;
      case "October":
        predictionData.push(10);
        break;
      case "November":
        predictionData.push(11);
        break;
      case "December":
        predictionData.push(12);
        break;

    }
  }

  //create tensors
  xs = tf.tensor2d(envData);
  labelsTensor = tf.tensor1d(predictionData, "int32");
  ys = tf.oneHot(labelsTensor, 2).cast("float32");
  labelsTensor.dispose();
  // console.log(`xs: ${xs}`)
  // console.log(`ys: ${ys}`)

  //create a sequential model
  model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [2], units: 16, activation: "sigmoid" }),
      tf.layers.dense({ units: 2, activation: "softmax" }),
    ],
  });

  //compile the model
  const LEARNING_RATE = 0.2;
  const optimizer = tf.train.sgd(LEARNING_RATE);

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

}


async function train() {
  //fit the model to the training data
  await model.fit(xs, ys, {
    shuffle: true,
    batchSize: 12,
    validationSplit: 0.1,
    epochs: 10,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`epoch: ${epoch}`);
        console.log(`loss: ${logs.loss}`);
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        labelP.html("Training done!")
      },
    },
  });
}

function keyPressed() {
 if (key == "t" && !training) {
   train();
   labelP.html("Training..")
   training = true;
 }
  
  if (key == "p") {

    if (next < tablePredictions.getRowCount() - 1) {
      next += 1;
    } else {
      next = 0;
    }
  
    readings = [
      tablePredictions.getNum(next, "sm_5cm"),
      tablePredictions.getNum(next, "sm_20cm"),
    ];

    tf.tidy(() => {
      const input = tf.tensor2d([readings]);
      let results = model.predict(input);
      let index = results.argMax(1).dataSync()[0];
      let label = labelList[index];
      labelP.html(label);
      console.log(results.argMax(1).dataSync())
    });

  }
}

/* saveModel.mousePressed(async function(){
  await model.save('localstorage://my-model');

})
loadModel.mousePressed(async function(){
  await tf.loadLayersModel('localstorage://my-model');
}) */