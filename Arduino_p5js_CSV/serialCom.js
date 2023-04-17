/* jshint esversion: 8 */

let msg;
let serialOptions = { baudRate: 9600 };
let serial;
let serialConnected = false;
let button;

let sensorData = 0;

function setupSerial() {
  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
//  
  button = createButton('connect to serial');
  button.position(10, 10);
  button.mousePressed(connectPort);

  button = createButton('disconnect from serial');
  button.position(200, 10);
  button.mousePressed(disconnectPort);
}


async function connectPort() {
  if (!serial.isOpen()) {
    await serial.connectAndOpen(null, serialOptions);
  }else {
     serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);
  }
}

async function disconnectPort() {
  if (serial.isOpen()) {
    await serial.close();
    serialConnected = false;
  } else {
    console.log("Serial port is not open!");
  }
}



/**
 * Callback function by serial.js when there is an error on web serial
 */
 function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
 
}

/**
 * Callback function by serial.js when web serial connection is opened
 */
function onSerialConnectionOpened(eventSender) {
  console.log("Serial connection opened successfully");
  serialConnected = true
  //button.remove();
}

/**
 * Callback function by serial.js when web serial connection is closed
 */
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");

}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */

function onSerialDataReceived(eventSender, newData) {
  console.log(newData)
   if(newData.startsWith("data:")){
    sensorData = newData.split(":")[1].trim()
  
   }

     /* 
  For longer data streams, we can use the following code to parse the data to indivudal values
  if (sensorData) {
    var dataArray = sensorData.split(','); // split the incomming string into aray items based on comma seperation

  for (let i = 0; i < dataArray.length; i++) {
      let value = parseFloat(dataArray[i]); // we expect floats in this example 
    }
  */
  
}

