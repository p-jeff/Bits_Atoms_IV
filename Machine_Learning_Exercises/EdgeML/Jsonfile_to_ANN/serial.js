let msg;
let serialOptions = { baudRate: 9600 };
let serial;
var connect = false;
let isConnected = false;
let serialData = { "co2": 400, "tvoc": 0, "temp": 25.8, "pressure": 94262.92, "altitude": 605.18, "humidity": 22, "timeStamp": 0, "label": "test" }


function setupSerial() {
  let settings = QuickSettings.create(100, 100, "settings");
  settings.addBoolean("connect", connect, () => connect = settings.getValue("connect"));
  settings.addButton("save model", () => label = saveData());
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
    // Add <p> element to provide messages. This is optional.
    msg = createP("");
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
