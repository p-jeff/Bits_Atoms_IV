let msg;
let serialOptions = { baudRate: 9600 };
let serial;
var connect = false;
let isConnected = false;
let trainingData;
let label = "test"
let serialData = { "co2": 400, "tvoc": 0, "temp": 25.8, "pressure": 94262.92, "altitude": 605.18, "humidity": 22, "timeStamp": 0, "label": "test" }
let recordData = false
let dataString = "";
let jsonData = []

function setup() {
  createCanvas(800, 600);
  background(255);


  let settings = QuickSettings.create(100, 100, "settings");
  settings.addBoolean("connect", connect, () => connect = settings.getValue("connect"));
  settings.addBoolean("Record Data", recordData, () => recordData = settings.getValue("Record Data"));
  settings.addText("Label", label, () => label = settings.getValue("Label"));
  settings.addButton("save file", () => label = saveData());

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
  // Add <p> element to provide messages. This is optional.
  msg = createP("");
  // setup table 
  trainingData = new p5.Table();
  for (let propertyName in serialData) {
    let name = propertyName;
    trainingData.addColumn(name);
  }

}

function draw() {
  background(0);
  fill(255)
  text(dataString, 20, 20);
  checkConnection();
  record();
}

function record() {

  if (serialData != 0 && recordData == true) {
    // prepare csv format
    let row = trainingData.addRow();

    for (let propertyName in serialData) {
      let name = propertyName;
      let value = serialData[propertyName]
      row.setString(name, value);
      // add to string format
      dataString += name +"; ";
      dataString += value +", ";
      
    }
// prepare json format
serialData.timeStamp = floor(millis());
serialData.label = label;
jsonData.push(serialData);
// prepare string format
    row.setString("timeStamp", floor(millis()));
    row.setString("label", label);

    dataString += "timeStamp: "+floor(millis())+"; ";
    dataString += "label: " + label;
    dataString += "\n"; // new line
    console.log(trainingData)
    serialData = 0;
  }


}

function saveData() {
 // saveTable(trainingData, "trainingData.csv");
  saveJSON(jsonData, 'trainingData.json');
}

function checkConnection() {
  // Check if connect button is pressed and the connection is not established
  if (connect && !isConnected) {
    connectPort();
    isConnected = true;
  } else if (!connect && isConnected) {
    closePort();
    isConnected = false;
  }
}

async function connectPort() {
  if (!serial.isOpen()) {
    await serial.connectAndOpen(null, serialOptions);
  } else {
    serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);
  }
}

async function closePort() {
  if (serial.isOpen()) {
    await serial.close();
  }
}

function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  msg.html(error);
}

function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  msg.html("Serial connection opened successfully");
}


function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  msg.html("onSerialConnectionClosed");
}

function onSerialDataReceived(eventSender, newData) {
  serialData = JSON.parse(newData);
  msg.html("onSerialDataReceived: " + newData);
}
