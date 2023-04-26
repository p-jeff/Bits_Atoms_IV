
async function getData() {
  const co2Input = await fetch('co2stats.json');  
  const co2stats = await co2Input.json();  
  
  const cleaned = co2stats.map(co2value => ({
    population: co2value.population_cdp,
    conc: co2value.scope1_ghg_emissions_tons_co2e,
  }))
  .filter(co2value => (co2value.population != null && co2value.conc != null));
  
  return cleaned;
}

async function run() {
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map(d => ({
    x: d.conc,
    y: d.population,
  }));

  tfvis.render.scatterplot(
    {name: 'co2 concentration vs population'},
    {values}, 
    {
      xLabel: 'co2 concentration ',
      yLabel: 'population',
      height: 300
    }
  );

  // Create the model
const model = createModel();  
tfvis.show.modelSummary({name: 'Model Summary'}, model);

//convert data to tensor
const tensorData = convertToTensor(data);
const {inputs, labels} = tensorData;
    
// Train the model  
await trainModel(model, inputs, labels);
console.log('Done Training');
  
testModel(model, data, tensorData);

}
//check if the document is ready
document.addEventListener('DOMContentLoaded', run);

function createModel() {
  // Create a sequential model
  const model = tf.sequential(); 
  
  // Add a single hidden layer
  model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
  
  // Add an output layer
  model.add(tf.layers.dense({units: 1, useBias: true}));

  return model;
}

function convertToTensor(data) {
  
  return tf.tidy(() => {
    // Step 1. Shuffle the data    
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map(d => d.conc)
    const labels = data.map(d => d.population);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();  
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds 
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });  
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training. 

  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });
  
  const batchSize = 28;
  const epochs = 50;
  
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'Mean Squared Error'], 
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  });

}

function testModel(model, inputData, normalizationData) {
  const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
  
  // Generate predictions for a uniform range of numbers between 0 and 1;
  // Then un-normalize the data by doing the inverse of the min-max scaling 
  
  const [xs, preds] = tf.tidy(() => {
    
    const xs = tf.linspace(0, 1, 100);      
    const preds = model.predict(xs.reshape([100, 1]));      
    
    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);
    
    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);
    
    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });
  
 
  const predictedPoints = Array.from(xs).map((val, i) => {
    return {x: val, y: preds[i]}
  });
  
  const originalPoints = inputData.map(d => ({
    x: d.conc, y: d.population,
  }));
  
  
  tfvis.render.scatterplot(
    {name: 'Model Predictions vs Original Data'}, 
    {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
    {
      xLabel: 'co2 concentration',
      yLabel: 'population',
      height: 300
    }
  );
}