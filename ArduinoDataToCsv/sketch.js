/* jshint esversion: 8 */
let trainingData;
let timestampLastTransmit = 0;
let counter = 0;

//make sure this equals to the interval set in the LoRa sketch
const MIN_TIME_BETWEEN_TRANSMISSIONS_MS = 5000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  trainingData = new p5.Table();
  trainingData.addColumn('id');
  trainingData.addColumn("Humidity");
 

  setupSerial();
}

function draw() {
  mappedData = map(int(sensorData), 786, 790, 100, 200);
  background(mappedData);
  circle(width / 2, height / 2, 100);
  const timeSinceLastTransmitMs = millis() - timestampLastTransmit;

  if (timeSinceLastTransmitMs > MIN_TIME_BETWEEN_TRANSMISSIONS_MS) {
    counter++;
    if (sensorData != 0) {
      let row = trainingData.addRow();
      row.setString('id', trainingData.getRowCount() - 1);
      row.setString("Humidity", sensorData);
  
      //save to table when 1000 entries are collected
      if (counter == 1000) {
        saveTable(trainingData, "trainingData.csv");
      }
    }

    timestampLastTransmit = millis(); 
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
