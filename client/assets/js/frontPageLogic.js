// Audio
var monkeyAudio = $("#monkeyAudio")[0];

function playAudio() {
  monkeyAudio.play();
}

function pauseAudio() {
  monkeyAudio.pause();
}

$("#playAudioButton").click(() => {
  playAudio();
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
