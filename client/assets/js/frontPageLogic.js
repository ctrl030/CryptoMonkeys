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

// Buttons to generate and mint monkeys

$("#buttonCalcDefaultMonkey").click(() => {
  renderMonkey(defaultDNA);
});

$("#buttonCalcRandomMonkey").click(() => {
  createRandomMonkey();
});

$("#buttonItsOver9000Monkey").click(() => {
  renderMonkey(itsOver9000DNA);
  console.log("IT'S OVER 9000");
});

$("#mintMonkey").click(() => {});
