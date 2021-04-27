// Styling monkeys, i.e. applying CSS to correct HTML structure
// First 4 functions do "basic color styling" to various parts of the monkey ("main colors" section & sliders)
// dnaEyeBackgroundColor and dnaLowerHeadColor do "advanced color styling" ("attributes" section & sliders)
// eyeVariation and mouthVariation change CSS shapes
// animationForMonkey create animantions (check animations.css)

// Note: All of these functions need a tokenId when called, to apply to correct HTML structure,
// which is unique via the containing #monkeyBox div id !
// If no tokenId is given, the htmlname variable will revert to its default "Creation", 
// therefore applying to the monkeyBox in creation mode

// color is an incoming Hex color code
// code is a 2-digit code between 10 and 98 - both variables relate to colors.js and are sent in when called

// As the function groups are described above, each group works the same, see first example of them to understand structure of all

function firstGroupColor(color, code, htmlname="Creation") {
  $(`#monkeyBox${htmlname} #mHeadTop, #monkeyBox${htmlname} .feet`).css(`background`, `#` + color); //This changes the color of the monkey
  $(`#firstGroupColorCode`).html(`code: ` + code); //This updates text of the badge next to the slider
  $(`#dnaFirstGroup${htmlname}`).html(code); //This updates DNA that is displayed below the monkey
}

function secondGroupColor(color, code, htmlname="Creation") {
  $(`#monkeyBox${htmlname} #eyesArea, 
    #monkeyBox${htmlname} #mouthArea, 
    #monkeyBox${htmlname} #mbody`)
    .css(`background`, `#` + color); 
  $(`#secondGroupColorCode`).html(`code: ` + code); 
  $(`#dnaSecondGroup${htmlname}`).html(code); 
}

function thirdGroupColor(color, code, htmlname="Creation") {
  $(`#monkeyBox${htmlname} .pupil, 
    #monkeyBox${htmlname} .arms, 
    #monkeyBox${htmlname} #leftNostril, 
    #monkeyBox${htmlname} #rightNostril`).css(
    `background`,
    `#` + color
  ); 
  $(`#thirdGroupColorCode`).html(`code: ` + code); 
  $(`#dnaThirdGroup${htmlname}`).html(code); 
}

function fourthGroupColor(color, code, htmlname="Creation") {
  $(`#monkeyBox${htmlname} .ears`).css(`background`, `#` + color); 
  $(`#fourthGroupColorCode`).html(`code: ` + code); 
  $(`#dnaFourthGroup${htmlname}`).html(code); 
}

function dnaEyeBackgroundColor(color, code, htmlname="Creation") {
  $(`#monkeyBox${htmlname} .eyes`).css(`background`, `#` + color); 
  $(`#eyeBackgroundColorCode`).html(`code: ` + code); 
  $(`#dnaEyeBackgroundColor${htmlname}`).html(code); 
}

function dnaLowerHeadColor(color, code, htmlname="Creation") {
  $(`#monkeyBox${htmlname} #mHeadLower`).css(`background`, `#` + color); 
  $(`#lowerHeadColorCode`).html(`code: ` + code); 
  $(`#dnaLowerHeadColor${htmlname}`).html(code); 
}

// So far this one does not do anything, besides generating this part of the DNA
function setSpecialNumber(lastNum, htmlname="Creation") {  
  $(`#dnaspecial${htmlname}`).html(lastNum); //This updates DNA that is displayed below the monkey
}





// Eye shape styling
function eyeVariation(num, htmlname="Creation") { // num is a 2-digit code that relates to colors.js and represents this part of the DNA string
  $(`#dnaEyeShape${htmlname}`).html(num); // updating DNA-HTML that is displayed below the monkey
  switch (num) {
    case 1:
      normalEyes(htmlname); 
      $(`#dnaEyeShapeCode`).html(`Basic`);
      break;
    case 2:
      normalEyes(htmlname); // Setting to normal first, taking out previous styling
      $(`#dnaEyeShapeCode`).html(`Down`); // Updating badge text next to the slider
      eyesType2(htmlname); // Applying new styling
      break;
    case 3:
      normalEyes(htmlname);
      $(`#dnaEyeShapeCode`).html(`Up`);
      eyesType3(htmlname);
      break;
    case 4:
      normalEyes(htmlname);
      $(`#dnaEyeShapeCode`).html(`Flat pupils`);
      eyesType4(htmlname);
      break;
    case 5:
      normalEyes(htmlname);
      $(`#dnaEyeShapeCode`).html(`Skinny pupils`);
      eyesType5(htmlname);
      break;
    case 6:
      normalEyes(htmlname);
      $(`#dnaEyeShapeCode`).html(`RARE`);
      eyesType6(htmlname);
      break;
    case 7:
      normalEyes(htmlname);
      $(`#dnaEyeShapeCode`).html(`IT'S OVER 9000`);
      eyesType7(htmlname);
      break;
  }
}

function normalEyes(htmlname) {
  $(`#monkeyBox${htmlname} .eyes`).css(`width`, `40px`);
  $(`#monkeyBox${htmlname} .eyes`).css(`top`, `10px`);
  $(`#monkeyBox${htmlname} .pupil`).css(`width`, `12px`);
  $(`#monkeyBox${htmlname} .pupil`).css(`height`, `15px`);
  $(`#monkeyBox${htmlname} .pupil`).css(`top`, `24px`);
  $(`#monkeyBox${htmlname} .pupil`).removeClass(`over9000Class`);
}

function eyesType2(htmlname) {
  $(`#monkeyBox${htmlname} .eyes`).css(`top`, `15px`);
}

function eyesType3(htmlname) {
  $(`#monkeyBox${htmlname} .eyes`).css(`top`, `5px`);
}

function eyesType4(htmlname) {
  $(`#monkeyBox${htmlname} .pupil`).css(`width`, `32px`);
}

function eyesType5(htmlname) {
  $(`#monkeyBox${htmlname} .pupil`).css(`height`, `32px`);
}

function eyesType6(htmlname) {
  $(`#monkeyBox${htmlname} .pupil`).css(`width`, `4px`);
  $(`#monkeyBox${htmlname} .pupil`).css(`height`, `4px`);
}

function eyesType7(htmlname) {
  $(`#monkeyBox${htmlname} .pupil`).css(`top`, `10px`);
  $(`#monkeyBox${htmlname} .pupil`).css(`width`, `42px`);
  $(`#monkeyBox${htmlname} .pupil`).css(`height`, `42px`);

  $(`#monkeyBox${htmlname} .pupil`).addClass(`over9000Class`);
}


// Mouth shape styling
function mouthVariation(num, htmlname="Creation") {
  $(`#dnaMouthShape${htmlname}`).html(num);
  switch (num) {
    case 1:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`Basic`);
      break;
    case 2:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`Skinny Mouth`);
      mouthType2(htmlname);
      break;
    case 3:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`Bullish`);
      mouthType3(htmlname);
      break;
    case 4:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`Whuat?`);
      mouthType4(htmlname);
      break;
    case 5:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`Flash Crash`);
      mouthType5(htmlname);
      break;
    case 6:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`RARE`);
      mouthType6(htmlname);
      break;
    case 7:
      normalMouth(htmlname);
      $(`#dnaMouthShapeCode`).html(`IT'S OVER 9000`);
      mouthType7(htmlname);
      break;
  }
}

function normalMouth(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`height`, `40px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`width`, `144px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `42px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`border-radius`, `20% 20% 50% 50%`);
}

function mouthType2(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `56px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`height`, `20px`);
}

function mouthType3(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `36px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`width`, `90px`);
}

function mouthType4(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`height`, `40px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`width`, `90px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `36px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`border-radius`, `50% 50% 50% 50%`);
}

function mouthType5(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `36px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`height`, `44px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`border-radius`, `10% 10% 10% 10%`);
}

function mouthType6(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`height`, `10px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`width`, `40px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `80px`);
}

function mouthType7(htmlname) {
  $(`#monkeyBox${htmlname} #mouthArea`).css(`height`, `65px`);
  $(`#monkeyBox${htmlname} #mouthArea`).css(`top`, `32px`);
}


// Monkey Animations
function animationForMonkey(num, htmlname="Creation") {
  $(`#dnaAnimation${htmlname}`).html(num);
  switch (num) {
    case 1:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`Basic`);
      break;
    case 2:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`Wiggle `);
      animationType2(htmlname);
      break;
    case 3:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`Big Head`);
      animationType3(htmlname);
      break;
    case 4:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`Bullrun`);
      animationType4(htmlname);
      break;
    case 5:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`Ghost`);
      animationType5(htmlname);
      break;
    case 6:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`RARE`);
      animationType6(htmlname);
      break;
    case 7:
      withoutAnimation(htmlname);
      $(`#dnaAnimationCode`).html(`IT'S OVER 9000`);
      animationType7(htmlname);
      break;
  }
}

function withoutAnimation(htmlname) {
  $(`#monkeyBox${htmlname} #leftArm`).removeClass(`movingLeftArmClass`);
  $(`#monkeyBox${htmlname} #rightArm`).removeClass(`movingRightArmClass`);
  $(`#monkeyBox${htmlname} #leftArm`).removeClass(`leftArmUpClass`);
  $(`#monkeyBox${htmlname} #rightArm`).removeClass(`rightArmUpClass`);

  $(`#monkeyBox${htmlname} #leftArm`).addClass(`leftArmPosition`);
  $(`#monkeyBox${htmlname} #rightArm`).addClass(`rightArmPosition`);

  $(`#monkeyBox${htmlname} #monkey`).removeClass(`jumpingClass`);
  $(`#monkeyBox${htmlname} #monkey`).removeClass(`fadingClass`);
  $(`#monkeyBox${htmlname} #mHead`).removeClass(`wigglingClass`);
  $(`#monkeyBox${htmlname} #mHead`).removeClass(`growingAndShrinkingClass`);

  $(`#monkeyBox${htmlname} .pupil`).removeClass(`growingAndShrinkingClass`);
}

function animationType2(htmlname) {
  $(`#monkeyBox${htmlname} #mHead`).addClass(`wigglingClass`);
}

function animationType3(htmlname) {
  $(`#monkeyBox${htmlname} #mHead`).addClass(`growingAndShrinkingClass`);
}

function animationType4(htmlname) {
  $(`#monkeyBox${htmlname} #monkey`).addClass(`jumpingClass`);
}

function animationType5(htmlname) {
  $(`#monkeyBox${htmlname} #monkey`).addClass(`fadingClass`);
}

function animationType6(htmlname) {
  $(`#monkeyBox${htmlname} #leftArm`).removeClass(`leftArmPosition`);
  $(`#monkeyBox${htmlname} #rightArm`).removeClass(`rightArmPosition`);

  $(`#monkeyBox${htmlname} #leftArm`).addClass(`movingLeftArmClass`);
  $(`#monkeyBox${htmlname} #rightArm`).addClass(`movingRightArmClass`);
}

function animationType7(htmlname) {
  $(`#monkeyBox${htmlname} #mHead`).addClass(`growingAndShrinkingClass`);

  $(`#monkeyBox${htmlname} #monkey`).addClass(`jumpingClass`);
  $(`#monkeyBox${htmlname} .pupil`).addClass(`growingAndShrinkingClass`);

  $(`#monkeyBox${htmlname} #leftArm`).removeClass(`leftArmPosition`);
  $(`#monkeyBox${htmlname} #rightArm`).removeClass(`rightArmPosition`);

  $(`#monkeyBox${htmlname} #leftArm`).addClass(`leftArmUpClass`);
  $(`#monkeyBox${htmlname} #rightArm`).addClass(`rightArmUpClass`);
}
