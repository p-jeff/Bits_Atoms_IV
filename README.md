# Bits_Atoms_IV
 Coding examples for Spatial Interaction Module. 

# Sketches I changes / worked on

### Environemtal Combo: SerialToP5js

This sketch now take the input of the sensor, and then renders a cloud based on the CO2 content. Depending on how high the CO2 in the surrounding is, the outer edges of the cloud also get darker.

### Machine Learning: ArtificialNeuralNetwork

Here lies the main part of my work in the module. The sketch first trains a color classification model. When hovering over the left canvast, this model starts to classify the colors beneath the cursor. 

The user then gets to pick a few point on the left canvas. When pressing train model, a second regression model is trained on the data of these points, which then tries to predict the mouse position based on the classification percentages.