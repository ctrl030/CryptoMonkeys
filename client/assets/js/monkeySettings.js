// See colors.js, makes all colors from there accessible
var colors = Object.values(allColors());

// DNA object, consisting of parameters for main colors and "attributes" (colors, shapes, animations, special)
var defaultDNA = {
  // Main colors
  headcolor: 12,
  mouthcolor: 14,
  eyescolor: 13,
  earscolor: 11,

  // Monkey attributes
  eyesShape: 1,
  mouthShape: 1,
  eyeBackgroundColor: 98,
  lowerHeadColor: 92,
  animation: 1,
  lastNum: 1,
};

// Crypto DNA, for when it's over 9000
var itsOver9000DNA = {
  headcolor: 12,
  mouthcolor: 14,
  eyescolor: 13,
  earscolor: 11,

  eyesShape: 7,
  mouthShape: 7,
  eyeBackgroundColor: 98,
  lowerHeadColor: 92,
  animation: 7,
  lastNum: 1,
};



// Creating random monkey by first calculating and storing random numbers between 10-98 or 1-6
// then setting these as values into a randomDNA object
// then calling the function to apply CSS and set sliders from randomDNA variable
function createRandomMonkey() {
  var randomHeadcolor = Math.floor(Math.random() * 89) + 10;
  var randommouthcolor = Math.floor(Math.random() * 89) + 10;
  var randomeyescolor = Math.floor(Math.random() * 89) + 10;
  var randomearscolor = Math.floor(Math.random() * 89) + 10;

  var randomeyesShape = Math.floor(Math.random() * 7) + 1;
  var randommouthShape = Math.floor(Math.random() * 7) + 1;

  var randomeyeBackgroundColor = Math.floor(Math.random() * 89) + 10;
  var randomlowerHeadColor = Math.floor(Math.random() * 89) + 10;

  var randomanimation = Math.floor(Math.random() * 7) + 1;
  var randomlastNum = Math.floor(Math.random() * 7) + 1;

  var randomDNA = {
    headcolor: randomHeadcolor,
    mouthcolor: randommouthcolor,
    eyescolor: randomeyescolor,
    earscolor: randomearscolor,

    eyesShape: randomeyesShape,
    mouthShape: randommouthShape,
    eyeBackgroundColor: randomeyeBackgroundColor,
    lowerHeadColor: randomlowerHeadColor,
    animation: randomanimation,
    lastNum: randomlastNum,
  };

  // create random DNA variable, create keys and calculate values and assign values to keys
  // then run renderMonkey(randomDNA);
  renderMonkey(randomDNA);
}

// when page loads, the "factory" monkey is shown, this way:
// factory monkey is selected via unique HTML structure (the "Creation" part in the end)
// default values are retrieved and put into the DNA display below the monkey
// then calling the function to apply CSS and set sliders from defaultDNA variable
$(document).ready(function () {
  $(`#dnaFirstGroupCreation`).html(defaultDNA.headcolor);
  $(`#dnaSecondGroupCreation`).html(defaultDNA.mouthcolor);
  $(`#dnaThirdGroupCreation`).html(defaultDNA.eyesColor);
  $(`#dnaFourthGroupCreation`).html(defaultDNA.earsColor);

  $(`#dnaEyeShapeCreation`).html(defaultDNA.eyesShape);
  $(`#dnaMouthShapeCreation`).html(defaultDNA.mouthShape);
  $(`#dnaEyeBackgroundColorCreation`).html(defaultDNA.eyeBackgroundColor);
  $(`#dnaLowerHeadColorCreation`).html(defaultDNA.lowerHeadColor);
  $(`#dnaAnimationCreation`).html(defaultDNA.animation);
  $(`#dnaspecialCreation`).html(defaultDNA.lastNum);

  // calling function to apply CSS and set sliders from defaultDNA variable
  renderMonkey(defaultDNA);
});


// Appending the CSS values to create the DNA string
// if no argument is given it defaults to "Creation", targetting the "factory" monkey
// elseway is given a tokenId to create the DNA string for the respective monkeyBox
function getDna(htmlname=`Creation`) {
  var dna = ``;
  dna += $(`#dnaFirstGroup${htmlname}`).html();
  dna += $(`#dnaSecondGroup${htmlname}`).html();
  dna += $(`#dnaThirdGroup${htmlname}`).html();
  dna += $(`#dnaFourthGroup${htmlname}`).html();
  dna += $(`#dnaEyeShape${htmlname}`).html();
  dna += $(`#dnaMouthShape${htmlname}`).html();
  dna += $(`#dnaEyeBackgroundColor${htmlname}`).html();
  dna += $(`#dnaLowerHeadColor${htmlname}`).html();
  dna += $(`#dnaAnimation${htmlname}`).html();
  dna += $(`#dnaspecial${htmlname}`).html();

  return dna;
}


// This is creating a monkey from a DNA , which is a 10 line block of code, see defaultDNA for ex.
// first line is calling the function that applies the CSS
// second line is setting the slider to the correct value
function renderMonkey(dna, htmlname) {
  firstGroupColor(colors[dna.headcolor], dna.headcolor, htmlname);
  $(`#headColorSlider`).val(dna.headcolor);

  secondGroupColor(colors[dna.mouthcolor], dna.mouthcolor, htmlname);
  $(`#mouthColorSlider`).val(dna.mouthcolor);

  thirdGroupColor(colors[dna.eyescolor], dna.eyescolor, htmlname);
  $(`#eyesColorSlider`).val(dna.eyescolor);

  fourthGroupColor(colors[dna.earscolor], dna.earscolor, htmlname);
  $(`#earsColorSlider`).val(dna.earscolor);

  eyeVariation(dna.eyesShape, htmlname);
  $(`#dnaEyeShapeSlider`).val(dna.eyesShape);

  mouthVariation(dna.mouthShape, htmlname);
  $(`#dnaMouthShapeSlider`).val(dna.mouthShape);

  dnaEyeBackgroundColor(colors[dna.eyeBackgroundColor], dna.eyeBackgroundColor, htmlname);
  $(`#eyeBackgroundColorSlider`).val(dna.eyeBackgroundColor);

  dnaLowerHeadColor(colors[dna.lowerHeadColor], dna.lowerHeadColor, htmlname);
  $(`#lowerHeadColorSlider`).val(dna.lowerHeadColor);

  animationForMonkey(dna.animation, htmlname);
  $(`#dnaAnimationSlider`).val(dna.animation);

  // only calling the function that applies the CSS
  setSpecialNumber(dna.lastNum, htmlname);

}


// Sliders are listenening, when used will change monkey colors and shapes 
// First line of code is listening 
// Second line is getting the new modification from the slider and saving it into colorVal variable
// Third line is implementing the change, calling the function with this variable 
// colorVal variable is a 2-digit code, that has a Hex color code assigned in colors.js
// colors[colorVal] is from the array in that file, resolving to the correct Hex color code
$(`#headColorSlider`).change(() => {
  var colorVal = $(`#headColorSlider`).val();
  firstGroupColor(colors[colorVal], colorVal);
});

$(`#mouthColorSlider`).change(() => {
  var colorVal = $(`#mouthColorSlider`).val();
  secondGroupColor(colors[colorVal], colorVal);
});

$(`#eyesColorSlider`).change(() => {
  var colorVal = $(`#eyesColorSlider`).val();
  thirdGroupColor(colors[colorVal], colorVal);
});

$(`#earsColorSlider`).change(() => {
  var colorVal = $(`#earsColorSlider`).val();
  fourthGroupColor(colors[colorVal], colorVal);
});

$(`#dnaEyeShapeSlider`).change(() => {
  var eyeShape = parseInt($(`#dnaEyeShapeSlider`).val());
  eyeVariation(eyeShape);
});

$(`#dnaMouthShapeSlider`).change(() => {
  var mouthShape = parseInt($(`#dnaMouthShapeSlider`).val());
  mouthVariation(mouthShape);
});

$(`#eyeBackgroundColorSlider`).change(() => {
  var colorVal = $(`#eyeBackgroundColorSlider`).val();
  dnaEyeBackgroundColor(colors[colorVal], colorVal);
});

$(`#lowerHeadColorSlider`).change(() => {
  var colorVal = $(`#lowerHeadColorSlider`).val();
  dnaLowerHeadColor(colors[colorVal], colorVal);
});

$(`#dnaAnimationSlider`).change(() => {
  var animationVal = parseInt($(`#dnaAnimationSlider`).val());
  animationForMonkey(animationVal);
});
