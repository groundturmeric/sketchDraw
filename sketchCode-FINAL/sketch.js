// This sketch is based on the official HandPose example from ml5js:
// DEMO:
// https://editor.p5js.org/jonfroehlich/sketches/Nn4pXTpbu
// https://makeabilitylab.github.io/physcomp/communication/handpose-serial.html
//
// using HANDPOSE mdodel!

let handPoseModel;
let video;
let curHandPose = null;
let isHandPoseModelInitialized = false;

let pg;

let indexX;
let indexY;

let pIndexX;
let pIndexY;


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  pixelDensity(1);
  pg = createGraphics(width, height);

  handPoseModel = ml5.handpose(video, onHandPoseModelReady);

  // Call onNewHandPosePrediction every time a new handPose is predicted
  handPoseModel.on("predict", onNewHandPosePrediction);

  // Hide the video element, and just show the canvas
  video.hide();

}

function onHandPoseModelReady() {
  console.log("HandPose model ready!");
  isHandPoseModelInitialized = true;
}

function onNewHandPosePrediction(predictions) {
  if (predictions && predictions.length > 0) {
    curHandPose = predictions[0];
    // console.log(curHandPose);
  } else {
    curHandPose = null;
  }
}


///
///////
////////////////
/////////////////////////////////
/////////////////////////////////////////////////////////////
function draw() {

  const flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0, width, height);
  // background(0)
  image(pg, 0, 0, width, height);

  if (!isHandPoseModelInitialized) {
    background(100);
    push();
    textSize(32);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text("Waiting for HandPose model to load...", width / 2, height / 2);
    pop();
  }

  if (curHandPose) {
    drawHand(curHandPose);
  }
}
////////////////////////////////////////////////////////////////
///////////////////////////////////
///////////////
/////
///



// A function to draw ellipses over the detected keypoints
function drawHand(handPose) {
  // The handPose data is in this format, see: https://learn.ml5js.org/#/reference/handPose?id=predict
  // {
  //   handInViewConfidence: 1, // The probability of a hand being present.
  //   boundingBox: { // The bounding box surrounding the hand.
  //     topLeft: [162.91, -17.42],
  //     bottomRight: [548.56, 368.23],
  //   },
  //   landmarks: [ // The 3D coordinates of each hand landmark.  <<<<<<< 3D coordinates!!!!
  //     [472.52, 298.59, 0.00],
  //     [412.80, 315.64, -6.18],
  //     ...
  //   ],
  //   annotations: { // Semantic groupings of the `landmarks` coordinates.
  //     thumb: [
  //       [412.80, 315.64, -6.18]
  //       [350.02, 298.38, -7.14],
  //       ...
  //     ],
  //     ...
  //   }
  drawIndexBubble(handPose);
}




// A function to draw the skeletonsf
function drawIndexBubble(handPose) {
  if (!handPose) {
    return;
  }
  noFill();
  const a = handPose.annotations;



  // console.log(a.middleFinger[3][1])
  // console.log(a.middleFinger[2][1])


  strokeWeight(0)
  fill(0)

  X = a.indexFinger[3][0];
  Y = a.indexFinger[3][1];
  Z = a.indexFinger[3][2];
  indexX = map(X, 0, width, width, 0);
  indexY = a.indexFinger[3][1];

  if (a.middleFinger[3][1] > a.middleFinger[2][1] && a.ringFinger[3][1] > a.ringFinger[2][1]) {
    ellipse(indexX, indexY, 20)


    // diameter = dist(indexX, indexY, pIndexX, pIndexY);
    console.log(Z)

    pg.stroke(-80 * Z, -Z * 20, -80 * Z);
    // pg.stroke(230, 80, 0);
    pg.strokeWeight(15);
    // pg.strokeWeight(Z*4);
    pg.line(indexX, indexY, pIndexX, pIndexY);

    pIndexX = indexX;
    pIndexY = indexY;
  } else {

    pIndexX = indexX;
    pIndexY = indexY;

  }

}

// Press key board key to clear
function keyPressed() {
  pg.clear();
}