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
  $("#dnabody").html(defaultDNA.headcolor);
  $("#dnamouth").html(defaultDNA.mouthcolor);
  $("#dnaeyes").html(defaultDNA.eyesColor);
  $("#dnaears").html(defaultDNA.earsColor);

  $("#dnaEyeShape").html(defaultDNA.eyesShape);
  $("#dnaMouthShape").html(defaultDNA.mouthShape);
  $("#dnaEyeBackgroundColor").html(defaultDNA.eyeBackgroundColor);
  $("#dnaLowerHeadColor").html(defaultDNA.lowerHeadColor);
  $("#dnaAnimation").html(defaultDNA.animation);
  $("#dnaspecial").html(defaultDNA.lastNum);

  renderMonkey(defaultDNA);
});

function getDna() {
  var dna = "";
  dna += $("#dnabody").html();
  dna += $("#dnamouth").html();
  dna += $("#dnaeyes").html();
  dna += $("#dnaears").html();
  dna += $("#dnaEyeShape").html();
  dna += $("#dnaMouthShape").html();
  dna += $("#dnaEyeBackgroundColor").html();
  dna += $("#dnaLowerHeadColor").html();
  dna += $("#dnaAnimation").html();
  dna += $("#dnaspecial").html();

  return dna;
}

function renderMonkey(dna) {
  firstGroupColor(colors[dna.headcolor], dna.headcolor);
  $("#headColorSlider").val(dna.headcolor);

  secondGroupColor(colors[dna.mouthcolor], dna.mouthcolor);
  $("#mouthColorSlider").val(dna.mouthcolor);

  thirdGroupColor(colors[dna.eyescolor], dna.eyescolor);
  $("#eyesColorSlider").val(dna.eyescolor);

  fourthGroupColor(colors[dna.earscolor], dna.earscolor);
  $("#earsColorSlider").val(dna.earscolor);

  eyeVariation(dna.eyesShape);
  $("#dnaEyeShapeSlider").val(dna.eyesShape);

  mouthVariation(dna.eyesShape);
  $("#dnaMouthShapeSlider").val(dna.mouthShape);

  dnaEyeBackgroundColor(colors[dna.eyeBackgroundColor], dna.eyeBackgroundColor);
  $("#eyeBackgroundColorSlider").val(dna.eyeBackgroundColor);

  dnaLowerHeadColor(colors[dna.lowerHeadColor], dna.lowerHeadColor);
  $("#lowerHeadColorSlider").val(dna.lowerHeadColor);

  animationForMonkey(dna.animation);
  $("#dnaAnimationSlider").val(dna.animation);
}

// Changing monkey colors
$("#headColorSlider").change(() => {
  var colorVal = $("#headColorSlider").val();
  firstGroupColor(colors[colorVal], colorVal);
});

$("#mouthColorSlider").change(() => {
  var colorVal = $("#mouthColorSlider").val();
  secondGroupColor(colors[colorVal], colorVal);
});

$("#eyesColorSlider").change(() => {
  var colorVal = $("#eyesColorSlider").val();
  thirdGroupColor(colors[colorVal], colorVal);
});

$("#earsColorSlider").change(() => {
  var colorVal = $("#earsColorSlider").val();
  fourthGroupColor(colors[colorVal], colorVal);
});

$("#dnaEyeShapeSlider").change(() => {
  var eyeShape = parseInt($("#dnaEyeShapeSlider").val());
  eyeVariation(eyeShape);
});

$("#dnaMouthShapeSlider").change(() => {
  var mouthShape = parseInt($("#dnaMouthShapeSlider").val());
  mouthVariation(mouthShape);
});

$("#eyeBackgroundColorSlider").change(() => {
  var colorVal = $("#eyeBackgroundColorSlider").val();
  dnaEyeBackgroundColor(colors[colorVal], colorVal);
});

$("#lowerHeadColorSlider").change(() => {
  var colorVal = $("#lowerHeadColorSlider").val();
  dnaLowerHeadColor(colors[colorVal], colorVal);
});

$("#dnaAnimationSlider").change(() => {
  var animationVal = parseInt($("#dnaAnimationSlider").val());
  animationForMonkey(animationVal);
});
