// Audio functionality
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

// Buttons to switch between two types of sliders visually
$("#showColorSlidersButton").click(() => {
  $(".colorSliders").show();
  $(".attributesSliders").hide();
});

$("#showAttributesSlidersButton").click(() => {
  $(".colorSliders").hide();
  $(".attributesSliders").show();
});

// Buttons for the monkey creation / styling
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

