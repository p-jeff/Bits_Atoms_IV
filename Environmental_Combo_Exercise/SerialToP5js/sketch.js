let msg;
let serialOptions = { baudRate: 9600 };
let serial;
var connect = false;
let isConnected = false;
let serialData = {"co2":400,"tvoc":0,"temp":25.8,"pressure":94262.92,"altitude":605.18,"humidity":22}

function setup() {
  createCanvas(1300, 700);
  background(255);
  gui = createGui("");
  gui.addGlobals('connect');

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
  // Add <p> element to provide messages. This is optional.
  msg = createP("");

}

function draw() {
  background(0);
  // simple visualization of the serial data
  let dataLength = Object.keys(serialData).length;
  let horizontalSpacing = width/dataLength;
  push();
  translate(horizontalSpacing/2, height/2);
  textAlign(CENTER);
  for (let propertyName in serialData) {
    let name = propertyName;
    let value = serialData[propertyName]
    value = constrain(value,0,200);
    fill(255);
    circle(0, 0, value);
    text(name + ": " + value, 0, 250);
    translate(horizontalSpacing,0);
  }
  pop();
  checkConnection();
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
  console.log("onSerialDataReceived", newData);
  msg.html("onSerialDataReceived: " + newData);
}
