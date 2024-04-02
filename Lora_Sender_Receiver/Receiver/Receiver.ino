#include <SPI.h>
#include <LoRa.h>

String contents = "";
String myUniqueId = "asdfw1";

void setup() {
  Serial.begin(9600);
  while (!Serial);

  Serial.println("LoRa Receiver");

  if (!LoRa.begin(868E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // received a packet
    Serial.print("Received packet '");

    // read packet
    while (LoRa.available()) {
      contents += (char)LoRa.read();
    }
    Serial.println(contents);
    // print RSSI of packet (Received Signal Strength Indicator)
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());
    int commaIndex = contents.indexOf(',');
    String data = contents.substring(0, commaIndex);
    String ID = contents.substring(commaIndex + 1);

    if (data && ID) {
      Serial.println("Recieved Matching format");
      if (ID.equals(myUniqueId)) {
          Serial.println("ID matches!");
          digitalWrite(LED_BUILTIN, HIGH);
          Serial.print("data: ");
          Serial.println(data);
        } else {
          Serial.print(myUniqueId);
          Serial.print(" does not match ");
          Serial.println(ID);
          digitalWrite(LED_BUILTIN, LOW);
        }
    }
    contents = "";
  }
}
