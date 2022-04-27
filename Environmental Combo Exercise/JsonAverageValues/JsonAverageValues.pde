float co2, tvoc, temp, pressure, altitude, humidity;
FloatList co2_list, tvoc_list, temp_list, pressure_list, altitude_list, humidity_list;
JSONArray data;
String[] properties;


void setup() {
  size(800, 800);
  background(255);
  noStroke();
  smooth(4);
  textSize(32);
  
  
  data = loadJSONArray("data/environmentalData.json");
  co2_list = new FloatList();
  tvoc_list = new FloatList();
  temp_list = new FloatList();
  pressure_list = new FloatList();
  altitude_list = new FloatList();
  humidity_list = new FloatList();
  
  for (int i = 0; i < data.size(); i++) {
    //JSONObject time = data.getJSONObject(0); 
    JSONObject reading = data.getJSONObject(1); 

    co2 = reading.getFloat("co2");
    co2_list.append(co2);
    
    tvoc = reading.getFloat("tvoc");
    tvoc_list.append(tvoc);
    
    temp = reading.getFloat("temp");
    temp_list.append(temp);
    
    pressure = reading.getFloat("pressure");
    pressure_list.append(pressure);
    
    altitude = reading.getFloat("altitude");
    altitude_list.append(altitude);
    
    humidity = reading.getFloat("humidity");
    humidity_list.append(humidity);
    
    println(co2 + "ppm, " + tvoc + "ppb, " + temp + "C, " + pressure + "Pa, "  + altitude + "m, " + humidity + "%");
    
  }
   fill(0);
   drawAverageValue(co2_list, "co2", 100, 100);
   drawAverageValue(tvoc_list, "tvoc", 100, 200);
   drawAverageValue(temp_list, "temp", 100, 300);
   drawAverageValue(pressure_list, "pressure", 100, 400);
   drawAverageValue(altitude_list, "altitude", 100, 500);
   drawAverageValue(humidity_list, "humidity", 100, 600);
}

void draw() {

}


void drawAverageValue(FloatList vals, String k, int x , int y) {
  float sum = 0;
  for (int i = 0; i < vals.size(); i++) {
       sum += vals.get(i);
  } 
  
  float average = sum/vals.size();
  text(String.format("The average %s is %.2f", k, average), x, y);
 
} 
