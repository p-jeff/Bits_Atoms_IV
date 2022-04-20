let maxX = 0;
let maxY = 0;
let maxBrightness = 0;
let moonImage;
let brightPixels = [];

function preload() {
  moonImage = loadImage("moon.jpg");
}

function setup() {
  createCanvas(600, 600);
  background(0);  
  noLoop();
}

function draw() {
  // load the pixels array
  moonImage.loadPixels();
  image(moonImage, 0, 0, moonImage.width, moonImage.height);

  // index into image pixel array
  for (let y = 0; y < moonImage.height; y++) {
    for (let x = 0; x < moonImage.width; x++) {
      const c = getRGBA(moonImage, x, y);
      var bright = brightness(c);
      if (bright > maxBrightness) {
        maxBrightness = bright;
        maxX = x;
        maxY = y;

        let brightPixel = {x:maxX, y:maxY };
        brightPixels.push(brightPixel);

      }
      let bunch = findClusters(brightPixels)
      for (let i = 0; i < bunch.length - 1; i++) {
        let p = bunch[i].pixels[0];
        let pp = bunch[i+1].pixels[0];
        let dis = dist(p.x, p.y, pp.x, pp.y);

        if(dis < 10){
          stroke(255)
          noFill();
          ellipse(p.x, p.y, 10, 10);
        }
      }

    }
  }

  moonImage.updatePixels();
  noLoop();
}

function getRGBA(img, x, y) {
  let i = (x + y * img.width) * 4;
  return [
    img.pixels[i], //R
    img.pixels[i + 1], //G
    img.pixels[i + 2], //B
   // img.pixels[i + 3], //A
  ];
}

//find clusters of bright pixels
function findClusters(brightPixels) { 
  let clusters = [];
  for (let i = 0; i < brightPixels.length; i++) {
    let pixel = brightPixels[i];
    let found = false;
    for (let j = 0; j < clusters.length; j++) {
      let cluster = clusters[j];

      if (cluster.contains(pixel)) {
        cluster.add(pixel);
        found = true;
        break;
      }
    }

    if (!found) {
      let cluster = new Cluster(pixel);
      clusters.push(cluster);
    }
  }

 
  return clusters;
}

class Cluster {
  constructor(pixel) {
    this.pixels = [pixel];
  }

  add(pixel) {
    this.pixels.push(pixel);
  }

  contains(pixel) {
    for (let i = 0; i < this.pixels.length; i++) {
      let p = this.pixels[i];
      if (p.x == pixel.x && p.y == pixel.y) {
        return true;
      }
    }
    return false;
  }

 


}