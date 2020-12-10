var colors = Object.values(allColors());

var defaultDNA = {
  headcolor: 12,
  mouthcolor: 14,
  eyescolor: 13,
  earscolor: 11,

  //Monkey attributes
  eyesShape: 1,
  mouthShape: 1,
  eyeBackgroundColor: 98,
  lowerHeadColor: 92,
  animation: 1,
  lastNum: 1,
};

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

// when page load
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

  renderMonkey(defaultDNA);
});



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


// This is creating the monkey from a DNA , which is a 10 line block of code, see defaultDNA for ex.
// first line is calling the function that applies the CSS
// second line is setting the slider to the correct value
function renderMonkey(dna) {
  firstGroupColor(colors[dna.headcolor], dna.headcolor);
  $(`#headColorSlider`).val(dna.headcolor);

  secondGroupColor(colors[dna.mouthcolor], dna.mouthcolor);
  $(`#mouthColorSlider`).val(dna.mouthcolor);

  thirdGroupColor(colors[dna.eyescolor], dna.eyescolor);
  $(`#eyesColorSlider`).val(dna.eyescolor);

  fourthGroupColor(colors[dna.earscolor], dna.earscolor);
  $(`#earsColorSlider`).val(dna.earscolor);

  eyeVariation(dna.eyesShape);
  $(`#dnaEyeShapeSlider`).val(dna.eyesShape);

  mouthVariation(dna.eyesShape);
  $(`#dnaMouthShapeSlider`).val(dna.mouthShape);

  dnaEyeBackgroundColor(colors[dna.eyeBackgroundColor], dna.eyeBackgroundColor);
  $(`#eyeBackgroundColorSlider`).val(dna.eyeBackgroundColor);

  dnaLowerHeadColor(colors[dna.lowerHeadColor], dna.lowerHeadColor);
  $(`#lowerHeadColorSlider`).val(dna.lowerHeadColor);

  animationForMonkey(dna.animation);
  $(`#dnaAnimationSlider`).val(dna.animation);
}

// Sliders are listenening, on change monkey colors and shapes are modified
// First line is listening, second is getting the new modification from the slider and saving it into a variable
// Third is implementing the change, calling the function with this variable  
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
