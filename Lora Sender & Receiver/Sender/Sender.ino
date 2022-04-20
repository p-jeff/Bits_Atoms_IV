#include <SPI.h>
#include <LoRa.h>

int counter = 0;
String myUniqueId = "asdfw1";

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("LoRa Sender");
  if (!LoRa.begin(868E6)) {
    Serial.println("Starting LoRa failed!");
    while(1);
  }
 delay(1000);
 pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(A0);

  Serial.print("Sending packet: ");
  Serial.println(counter);
  // send packet
  LoRa.beginPacket();
  LoRa.print(sensorValue);
  LoRa.print(",");
  LoRa.print(myUniqueId);
  LoRa.endPacket();
  counter++;
  digitalWrite(LED_BUILTIN, HIGH);   
  delay(1000);                      
  digitalWrite(LED_BUILTIN, LOW);  
  delay(4000);    
}
