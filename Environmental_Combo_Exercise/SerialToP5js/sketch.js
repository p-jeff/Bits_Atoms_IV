let msg;
let serialOptions = { baudRate: 9600 };
let serial;
var connect = false;
let isConnected = false;
let serialData = {
  co2: 1300,
  tvoc: 0,
  temp: 25.8,
  pressure: 94262.92,
  altitude: 605.18,
  humidity: 22,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = createGui("");
  gui.addGlobals("connect");
  // Setup Web Serial using serial.js
  frameRate(10);
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
  // Add <p> element to provide messages. This is optional.
  msg = createP("");
  colorMode(HSB, 100);
}

function draw() {

  
  // simple visualization of the serial data

  let name = 'co2';
  let value = serialData[name] / 3;
  background(50, 20, 70);

  for (let i = 0; i < value; i++) {
    let radius = random() * value;
    let angle = random(PI, 2 * PI);
    let x = width / 2 + radius * cos(angle);
    let y = height / 2 + radius * sin(angle);

    // Calculate distance from the center
    let distanceFromCenter = dist(x, y, width / 2, height / 2);
    
    // Calculate Brightness based on distance (closer to the center => brighter)
    let bright = map(distanceFromCenter, 0, width / 2, 80, 0);

    fill(0, 0, bright); 
    circle(x, y, random(50, 90));
    noStroke();
  }
  textAlign(CENTER, TOP);
  textFont('Arial', 20); // Change 'Arial' to the font you want to use
  
  fill(255);
  text('CO2' + ": " + serialData[name], width / 2, height / 2 + 100); // Center the text below the cloud


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
