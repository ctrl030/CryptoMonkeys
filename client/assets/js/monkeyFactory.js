//Random color
function getColor() {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

function genColors() {
  var colors = [];
  for (var i = 10; i < 99; i++) {
    var color = getColor();
    colors[i] = color;
  }
  return colors;
}

//This function code needs to modified so that it works with Your cat code.
function firstGroupColor(color, code, htmlName) {
  $(`#mHeadTop${htmlName}, .feet${htmlName}`).css(`background`, `#` + color); //This changes the color of the cat
  $(`#firstGroupColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnabody${htmlName}`).html(code); //This updates the body color part of the DNA that is displayed below the cat
}

function secondGroupColor(color, code, htmlName) {
  $(`#eyesArea${htmlName}, #mouthArea${htmlName}, #mbody${htmlName}`).css(`background`, `#` + color); //This changes the color of the cat
  $(`#secondGroupColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnamouth${htmlName}`).html(code); //This updates the body color part of the DNA that is displayed below the cat
}

function thirdGroupColor(color, code, htmlName) {
  $(`.pupil${htmlName}, .arms${htmlName}, #leftNostril${htmlName}, #rightNostril${htmlName}`).css(
    `background`,
    `#` + color
  ); //This changes the color of the cat
  $(`#thirdGroupColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnaeyes${htmlName}`).html(code); //This updates the body color part of the DNA that is displayed below the cat
}

function fourthGroupColor(color, code, htmlName) {
  $(`.ears${htmlName}`).css(`background`, `#` + color); //This changes the color of the cat
  $(`#fourthGroupColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnaears${htmlName}`).html(code); //This updates the body color part of the DNA that is displayed below the cat
}

function dnaEyeBackgroundColor(color, code, htmlName) {
  $(`.eyes${htmlName}`).css(`background`, `#` + color); //This changes the color of the cat
  $(`#eyeBackgroundColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnaEyeBackgroundColor${htmlName}`).html(code); //This updates the body color part of the DNA that is displayed below the cat
}

function dnaLowerHeadColor(color, code, htmlName) {
  $(`#mHeadLower${htmlName}`).css(`background`, `#` + color); //This changes the color of the cat
  $(`#lowerHeadColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnaLowerHeadColor${htmlName}`).html(code); //This updates the body color part of the DNA that is displayed below the cat
}

// Eye shape styling
function eyeVariation(num, htmlName) {
  $(`#dnaEyeShape${htmlName}`).html(num);
  switch (num) {
    case 1:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`Basic`);
      break;
    case 2:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`Down`);
      eyesType2(htmlName);
      break;
    case 3:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`Up`);
      eyesType3(htmlName);
      break;
    case 4:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`Flat pupils`);
      eyesType4(htmlName);
      break;
    case 5:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`Skinny pupils`);
      eyesType5(htmlName);
      break;
    case 6:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`RARE`);
      eyesType6(htmlName);
      break;
    case 7:
      normalEyes(htmlName);
      $(`#dnaEyeShapeCode`).html(`IT'S OVER 9000`);
      eyesType7(htmlName);
      break;
  }
}

function normalEyes(htmlName) {
  $(`.eyes${htmlName}`).css(`width`, `40px`);
  $(`.eyes${htmlName}`).css(`top`, `10px`);
  $(`.pupil${htmlName}`).css(`width`, `12px`);
  $(`.pupil${htmlName}`).css(`height`, `15px`);
  $(`.pupil${htmlName}`).css(`top`, `24px`);
  $(`.pupil${htmlName}`).removeClass(`over9000Class`);
}

function eyesType2(htmlName) {
  $(`.eyes${htmlName}`).css(`top`, `15px`);
}

function eyesType3(htmlName) {
  $(`.eyes${htmlName}`).css(`top`, `5px`);
}

function eyesType4(htmlName) {
  $(`.pupil${htmlName}`).css(`width`, `32px`);
}

function eyesType5(htmlName) {
  $(`.pupil${htmlName}`).css(`height`, `32px`);
}

function eyesType6(htmlName) {
  $(`.pupil${htmlName}`).css(`width`, `4px`);
  $(`.pupil${htmlName}`).css(`height`, `4px`);
}

function eyesType7(htmlName) {
  $(`.pupil${htmlName}`).css(`top`, `10px`);
  $(`.pupil${htmlName}`).css(`width`, `42px`);
  $(`.pupil${htmlName}`).css(`height`, `42px`);

  $(`.pupil${htmlName}`).addClass(`over9000Class`);
}

// Mouth shape styling

function mouthVariation(num, htmlName) {
  $(`#dnaMouthShape${htmlName}`).html(num);
  switch (num) {
    case 1:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`Basic`);
      break;
    case 2:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`Skinny Mouth`);
      mouthType2(htmlName);
      break;
    case 3:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`Bullish`);
      mouthType3(htmlName);
      break;
    case 4:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`Whuat?`);
      mouthType4(htmlName);
      break;
    case 5:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`Flash Crash`);
      mouthType5(htmlName);
      break;
    case 6:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`RARE`);
      mouthType6(htmlName);
      break;
    case 7:
      normalMouth(htmlName);
      $(`#dnaMouthShapeCode`).html(`IT'S OVER 9000`);
      mouthType7(htmlName);
      break;
  }
}

function normalMouth(htmlName) {
  $(`#mouthArea${htmlName}`).css(`height`, `40px`);
  $(`#mouthArea${htmlName}`).css(`width`, `144px`);
  $(`#mouthArea${htmlName}`).css(`top`, `42px`);
  $(`#mouthArea${htmlName}`).css(`border-radius`, `20% 20% 50% 50%`);
}

function mouthType2(htmlName) {
  $(`#mouthArea${htmlName}`).css(`top`, `56px`);
  $(`#mouthArea${htmlName}`).css(`height`, `20px`);
}

function mouthType3(htmlName) {
  $(`#mouthArea${htmlName}`).css(`top`, `36px`);
  $(`#mouthArea${htmlName}`).css(`width`, `90px`);
}

function mouthType4(htmlName) {
  $(`#mouthArea${htmlName}`).css(`height`, `40px`);
  $(`#mouthArea${htmlName}`).css(`width`, `90px`);
  $(`#mouthArea${htmlName}`).css(`top`, `36px`);

  $(`#mouthArea${htmlName}`).css(`border-radius`, `50% 50% 50% 50%`);
}

function mouthType5(htmlName) {
  $(`#mouthArea${htmlName}`).css(`top`, `36px`);
  $(`#mouthArea${htmlName}`).css(`height`, `44px`);
  $(`#mouthArea${htmlName}`).css(`border-radius`, `10% 10% 10% 10%`);
}

function mouthType6(htmlName) {
  $(`#mouthArea${htmlName}`).css(`height`, `10px`);
  $(`#mouthArea${htmlName}`).css(`width`, `40px`);
  $(`#mouthArea${htmlName}`).css(`top`, `80px`);
}

function mouthType7(htmlName) {
  $(`#mouthArea${htmlName}`).css(`height`, `65px`);
  $(`#mouthArea${htmlName}`).css(`top`, `32px`);
}


// Animation
function animationForMonkey(num, htmlName) {
  $(`#dnaAnimation${htmlName}`).html(num);
  switch (num) {
    case 1:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`Basic`);
      break;
    case 2:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`Wiggle `);
      animationType2(htmlName);
      break;
    case 3:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`Big Head`);
      animationType3(htmlName);
      break;
    case 4:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`Bullrun`);
      animationType4(htmlName);
      break;
    case 5:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`Ghost`);
      animationType5(htmlName);
      break;
    case 6:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`RARE`);
      animationType6(htmlName);
      break;
    case 7:
      withoutAnimation(htmlName);
      $(`#dnaAnimationCode`).html(`IT'S OVER 9000`);
      animationType7(htmlName);
      break;
  }
}

function withoutAnimation(htmlName) {
  $(`#leftArm${htmlName}`).removeClass(`movingLeftArmClass`);
  $(`#rightArm${htmlName}`).removeClass(`movingRightArmClass`);
  $(`#leftArm${htmlName}`).removeClass(`leftArmUpClass`);
  $(`#rightArm${htmlName}`).removeClass(`rightArmUpClass`);

  $(`#leftArm${htmlName}`).addClass(`leftArmPosition`);
  $(`#rightArm${htmlName}`).addClass(`rightArmPosition`);

  $(`#monkey${htmlName}`).removeClass(`jumpingClass`);
  $(`#monkey${htmlName}`).removeClass(`fadingClass`);
  $(`#mHead${htmlName}`).removeClass(`wigglingClass`);
  $(`#mHead${htmlName}`).removeClass(`growingAndShrinkingClass`);

  $(`.pupil${htmlName}`).removeClass(`growingAndShrinkingClass`);
}

function animationType2(htmlName) {
  $(`#mHead${htmlName}`).addClass(`wigglingClass`);
}

function animationType3(htmlName) {
  $(`#mHead${htmlName}`).addClass(`growingAndShrinkingClass`);
}

function animationType4(htmlName) {
  $(`#monkey${htmlName}`).addClass(`jumpingClass`);
}

function animationType5(htmlName) {
  $(`#monkey${htmlName}`).addClass(`fadingClass`);
}

function animationType6(htmlName) {
  $(`#leftArm${htmlName}`).removeClass(`leftArmPosition`);
  $(`#rightArm${htmlName}`).removeClass(`rightArmPosition`);

  $(`#leftArm${htmlName}`).addClass(`movingLeftArmClass`);
  $(`#rightArm${htmlName}`).addClass(`movingRightArmClass`);
}

function animationType7(htmlName) {
  $(`#mHead${htmlName}`).addClass(`growingAndShrinkingClass`);

  $(`#monkey${htmlName}`).addClass(`jumpingClass`);
  $(`.pupil${htmlName}`).addClass(`growingAndShrinkingClass`);

  $(`#leftArm${htmlName}`).removeClass(`leftArmPosition`);
  $(`#rightArm${htmlName}`).removeClass(`rightArmPosition`);

  $(`#leftArm${htmlName}`).addClass(`leftArmUpClass`);
  $(`#rightArm${htmlName}`).addClass(`rightArmUpClass`);
}
