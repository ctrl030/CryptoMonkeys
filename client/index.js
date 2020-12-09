var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0xA19Acd4a962B2DF3190De393CE44424a97ae5065";

$(document).ready(async function () {

  let factoryName = "Factory";

  $("#monkeyRow").append(generateHtmlStructure(factoryName));

  var accounts = await window.ethereum.enable();

  instance = new web3.eth.Contract(abi, contractAddress, {
    from: accounts[0],
  });

  user = accounts[0];

  console.log("indexjs instance: ");
  console.log(instance);
  console.log("user: " + user);
  console.log("accounts[0]: " + accounts[0]);

  var userBalance = await instance.methods.balanceOf(user).call();
  console.log(`user has ${userBalance} Crypto Monkeys`);

  // on pageload we subscribe to the MonkeyCreated event. From now on, whenever it is emitted (by anybody?), 
  // we get data sent and the css of the div will be emptied and then appended with 
  instance.events
    .MonkeyCreated()
    .on("data", function (event) {
      console.log(event);
      let owner = event.returnValues.owner;
      let tokenId = event.returnValues.tokenId;
      let parent1Id = event.returnValues.parent1Id;
      let parent2Id = event.returnValues.parent2Id;
      let genes = event.returnValues.genes;

      $(`#monkeyCreatedDiv`).css("display", "flex");
      $(`#monkeyCreatedDiv`).empty();
      $(`#monkeyCreatedDiv`).append(
        `        
          <ul>
            <li>Crypto Monkey created successfully!</li>
            <li>Here are the details: </li>
            <li>owner:  ${owner}</li> 
            <li>tokenId:  ${tokenId}</li>  
            <li>parent1Id: ${parent1Id}</li>
            <li>parent2Id: ${parent2Id}</li>
            <li>genes: ${genes}</li>
          </ul>
        `
      );
    })
    .on("error", function (error) {
      console.log(error);
    });
});


// listens to button click, then creates dnaStr (same format as genes) from concatting all the already set css values
// then calls the blockchain with these genes and mints a Crypto Monkey from them
$("#mintMonkey").click(() => {
  let dnaStr = getDna();

  instance.methods.createGen0Monkey(dnaStr).send({}, function (error, txHash) {
    if (error) {
      console.log(error);
    } else {
      console.log(txHash);
    }
  });

  
});


function generateHtmlStructure(htmlname) {
  return `
  <div class="monkeyBox monkeyBox${htmlname} m-2 light-b-shadow">
          <div id="monkey${htmlname}">
            <div id="mbody${htmlname}">
              <div id="mHead${htmlname}">
                <div id="earsArea${htmlname}">
                  <div class="ears${htmlname}" id="ear-left${htmlname}"></div>
                  <div class="ears${htmlname}" id="ear-right${htmlname}"></div>
                </div>

                <div id="mHeadTop${htmlname}">
                  <div id="eyesArea${htmlname}">
                    <div class="aroundEyesClass${htmlname}">
                      <div class="eyes${htmlname}" id="leftEye${htmlname}">
                        <span><div class="pupil${htmlname}"></div></span>
                      </div>
                    </div>

                    <div class="aroundEyesClass${htmlname}">
                      <div class="eyes${htmlname}" id="rightEye${htmlname}">
                        <span><div class="pupil${htmlname}"></div></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="mHeadLower${htmlname}">
                  <div id="noseArea${htmlname}">
                    <div id="leftNostril${htmlname}"></div>
                    <div id="rightNostril${htmlname}"></div>
                  </div>
                  <div id="mouthArea${htmlname}">
                    <div id="mouth${htmlname}"></div>
                  </div>
                </div>
              </div>

              <div id="armsArea${htmlname}">
                <div class="arms${htmlname} leftArmPosition${htmlname}" id="leftArm${htmlname}">
                  
                </div>
                <div class="arms${htmlname} rightArmPosition${htmlname}" id="rightArm${htmlname}">
                  
                </div>
              </div>

              <div id="feetArea${htmlname}">
                <div class="feet${htmlname}" id="leftFoot${htmlname}"></div>
                <div class="feet${htmlname}" id="rightFoot${htmlname}"></div>
              </div>
            </div>
          </div>

          <div class="dnaDiv${htmlname}" id="monkeyDNA${htmlname}">
            <b>
              DNA:
              // Colors 
              <span id="dnabodyFactory${htmlname}"></span>
              <span id="dnamouthFactory${htmlname}"></span>
              <span id="dnaeyesFactory${htmlname}"></span>
              <span id="dnaearsFactory${htmlname}"></span>

              // monkeyAttributes 
              <span id="dnaEyeShapeFactory${htmlname}"></span>
              <span id="dnaMouthShapeFactory${htmlname}"></span>
              <span id="dnaEyeBackgroundColorFactory${htmlname}"></span>
              <span id="dnaLowerHeadColorFactory${htmlname}"></span>
              <span id="dnaAnimationFactory${htmlname}"></span>
              <span id="dnaspecialFactory${htmlname}"></span>
            </b>
          </div>
        </div>

        <div class="col-lg-7 monkeyAttributes m-2 light-b-shadow">
          
          <div id="monkeySliders">           

            <div id="sliderButtonHolderDiv">
              <button
                type="button"
                class="btn btn-success"
                id="showColorSlidersButton"
              >
                Main Colors
              </button>
              <button
                type="button"
                class="btn btn-success"
                id="showAttributesSlidersButton"
              >
                Attributes
              </button>
            </div>

            <div class="colorSliders">
              <div class="form-group">
                <label for="formControlRange"
                  ><b>Upper head and feet</b
                  ><span
                    class="badge badge-success ml-2"
                    id="firstGroupColorCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="10"
                  max="98"
                  class="form-control-range"
                  id="headColorSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Body and mouth and around eyes</b
                  ><span
                    class="badge badge-success ml-2"
                    id="secondGroupColorCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="10"
                  max="98"
                  class="form-control-range"
                  id="mouthColorSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Pupils and arms and nostrils</b
                  ><span
                    class="badge badge-success ml-2"
                    id="thirdGroupColorCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="10"
                  max="98"
                  class="form-control-range"
                  id="eyesColorSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Ears</b
                  ><span
                    class="badge badge-success ml-2"
                    id="fourthGroupColorCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="10"
                  max="98"
                  class="form-control-range"
                  id="earsColorSlider"
                />
              </div>
            </div>

            <div class="attributesSliders">
              <div class="form-group">
                <label for="formControlRange"
                  ><b>Eye type</b
                  ><span
                    class="badge badge-success ml-2"
                    id="dnaEyeShapeCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  class="form-control-range"
                  id="dnaEyeShapeSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Mouth type</b
                  ><span
                    class="badge badge-success ml-2"
                    id="dnaMouthShapeCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  class="form-control-range"
                  id="dnaMouthShapeSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Eye background color</b
                  ><span
                    class="badge badge-success ml-2"
                    id="eyeBackgroundColorCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="10"
                  max="98"
                  class="form-control-range"
                  id="eyeBackgroundColorSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Lower head color</b
                  ><span
                    class="badge badge-success ml-2"
                    id="lowerHeadColorCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="10"
                  max="98"
                  class="form-control-range"
                  id="lowerHeadColorSlider"
                />
              </div>

              <div class="form-group">
                <label for="formControlRange"
                  ><b>Animation</b
                  ><span
                    class="badge badge-success ml-2"
                    id="dnaAnimationCode"
                  ></span
                ></label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  class="form-control-range"
                  id="dnaAnimationSlider"
                />
              </div>
            </div>
          </div>

          <div class="alert alert-success m-2 light-b-shadow" role="alert" id="monkeyCreatedDiv" style="display: none">
          </div>

        </div>
      </div>

      <div class="m-2 light-b-shadow" id="buttonHolderArea">
        <div class="" id="buttonHolderDiv">
          <button
            type="button"
            class="btn btn-success"
            id="buttonCalcDefaultMonkey"
          >
            Default Crypto Monkey
          </button>

          <button
            type="button"
            class="btn btn-success"
            id="buttonCalcRandomMonkey"
          >
            Random Crypto Monkey
          </button>

          <button
            type="button"
            class="btn btn-success"
            id="buttonItsOver9000Monkey"
          >
            IT'S OVER 9000
          </button>

          <button type="button" class="btn btn-success" id="mintMonkey">
            Mint Crypto Monkey
          </button>
        </div>
      </div>
      `
}