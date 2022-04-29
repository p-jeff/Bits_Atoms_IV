import processing.serial.*;

Serial myPort;
JSONObject incoming;
JSONArray values;
StringList environment;
int timer;

void setup() {
  size(500, 500);
  environment = new StringList();
  printArray(Serial.list());
  // Change the port number to match your arduino
  int portNumber = 1;
  myPort = new Serial(this, Serial.list()[portNumber], 9600);
  values = new JSONArray();
}

void draw() {
  String data = myPort.readStringUntil('\n');
  if (data == null) {
    return;
  }

  println(data);
  //add timestap to the current reading
  int time[]={hour(), minute(), second()};
  String now = nf(time[0], 2) + ":" + nf(time[1], 2) + ":"+ nf(time[2], 2);
  String formatTime = String.format("{ \"timestamp\": \"%s\"}", now);
  environment.append(formatTime);
  environment.append(data);

  //save incoming data to .json file
  for (int j = 0; j < environment.size(); j++) {
    String entry = environment.get(j);
    incoming = parseJSONObject(entry);

    if (incoming == null) {
      println("JSON could not be parsed!");
    }

    values.setJSONObject(j, incoming);
  }
  saveJSONArray(values, "data/environmentalData.json");
  println("saved");
}
void serialEvent(Serial myPort) {
  // check if data is available
  if (myPort.available() == 0) {
    return;
  }
}
