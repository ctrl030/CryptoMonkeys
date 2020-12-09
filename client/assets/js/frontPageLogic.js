// Audio
var monkeyAudio = $("#monkeyAudio")[0];
var monkeyAudio2 = $("#monkeyAudio2")[0];

function playAudio() {
  monkeyAudio2.pause();
  monkeyAudio.play();
}

function playAudio2() {
  monkeyAudio.pause();
  monkeyAudio2.play();
}

function pauseAudio() {
  monkeyAudio.pause();
  monkeyAudio2.pause();
}

$("#playAudioButton").click(() => {
  playAudio();
});

$("#playAudioButton2").click(() => {
  playAudio2();
});

$("#pauseAudioButton").click(() => {
  pauseAudio();
});

// Switch between sliders
$("#showColorSlidersButton").click(() => {
  $(".colorSliders").show();
  $(".attributesSliders").hide();
});

$("#showAttributesSlidersButton").click(() => {
  $(".colorSliders").hide();
  $(".attributesSliders").show();
});

// Buttons to generate monkeys

$("#buttonCalcDefaultMonkey").click(() => {
  let nameForDefault = "Factory";
  renderMonkey(defaultDNA, nameForDefault);
});

$("#buttonCalcRandomMonkey").click(() => {
  createRandomMonkey();
});

$("#buttonItsOver9000Monkey").click(() => {
  console.log("IT'S OVER 9000");
  let nameFor9000 = "Factory";
  renderMonkey(itsOver9000DNA, nameFor9000);
  console.log("IT'S OVER 9000");
});

