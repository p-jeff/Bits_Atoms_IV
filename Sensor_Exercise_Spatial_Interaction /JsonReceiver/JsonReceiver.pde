import processing.serial.*;

Serial myPort;
JSONObject incoming;
JSONArray values;
StringList environment;
int timer;

void setup() {
  size(500, 500);
  environment = new StringList();
  println(Serial.list());
  // open specific serial port
  // change this to match your settings
  myPort = new Serial(this, "/dev/cu.usbmodem1101", 9600);
  values = new JSONArray();
}

void draw() {
  String data = myPort.readStringUntil('\n');
  if (data == null) {
    return;
  }
 
  //save data only every 5 seconds
  //make sure this is about 100 milisecond less as your delay in Arduino sketch
  if (millis() - timer >= 4900) {
    //println(millis() - timer);
    
    //add timestap to the current reading
     int time[]={hour(),minute(),second()};
     String now = nf(time[0],2) + ":" + nf(time[1],2) + ":"+ nf(time[2],2);
     String formatTime = String.format("{ \"timestamp\": \"%s\"}", now); 
     environment.append(formatTime);
     environment.append(data);
     timer = millis(); 
     
  }
 
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
  
  
}
void serialEvent(Serial myPort) {
  // check if data is available
  if (myPort.available() == 0){
    return;
  } 
}


 
