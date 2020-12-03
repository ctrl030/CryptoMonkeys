var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0xF9c78cdEc35af7feF8FDf0fd92878e2c3EBb7668";

$(document).ready(async function () {
  // creating a box
  // querying the DNA from the blockchain, from an array, start with position 1 , think about how to fill position zero
  // running the DNA string as arguments to showing the monkey in the box
  // now add this all to the html

  var accounts = await window.ethereum.enable();

  instance = new web3.eth.Contract(abi, contractAddress, {
    from: accounts[0],
  });

  user = accounts[0];

  console.log("galleryjs instance: ");
  console.log(instance);
  console.log("user: " + user);
  console.log("accounts[0]: " + accounts[0]);

  //XXX
  var usersMonkeys = [];

  //XXX
  //await;

  //XXX
  // let dnaStr = getDna();

  let myMonkeyArray = await instance.methods
    .findAllMyMonkeys()
    .call((error, result) => {
      if (error) {
        console.log("error: " + error);
      } else {
        console.log("myMonkeyArray: ");
        console.log(result);
      }
    });

  let getSomeMonkeys = await instance.methods
    .createGen0Monkey(1234567)
    .send({}, function (error, txHash) {
      if (error) {
        console.log(error);
      } else {
        console.log(txHash);
      }
    });

  /*
  createGen0Monkey(dnaStr).send({}, function (error, txHash) {
    if (error) {
      console.log(error);
    } else {
      console.log(txHash);
    }
  });
*/
  instance.events
    .MonkeyCreated()
    .on("data", function (event) {
      console.log(event);
      let owner = event.returnValues.owner;
      let tokenId = event.returnValues.tokenId;
      let parent1Id = event.returnValues.parent1Id;
      let parent2Id = event.returnValues.parent2Id;
      let genes = event.returnValues.genes;
      $("#monkeyCreatedDiv").css("display", "flex");
      $("#monkeyCreatedDiv").text(
        "Crypto Monkey created successfully! Here are the details: " +
          " owner: " +
          owner +
          " tokenId: " +
          tokenId +
          " parent1Id: " +
          parent1Id +
          " parent2Id: " +
          parent2Id +
          " genes: " +
          genes
      );
    })
    .on("error", function (error) {
      console.log(error);
    });
  /*
  function displayAllMonkeys(dnaString) {
    $("#galleryRow").append(
      `
        <div class="monkeyBox m-2 light-b-shadow">       
          <div id="monkey">
            <div id="mbody">
              <div id="mHead">
                <div id="earsArea">
                  <div class="ears" id="ear-left"></div>
                  <div class="ears" id="ear-right"></div>
                </div>

                <div id="mHeadTop">
                  <div id="eyesArea">
                    <div class="aroundEyes">
                      <div class="eyes" id="leftEye">
                        <span><div class="pupil"></div></span>
                      </div>
                    </div>

                    <div class="aroundEyes">
                      <div class="eyes" id="rightEye">
                        <span><div class="pupil"></div></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="mHeadLower">
                  <div id="noseArea">
                    <div id="leftNostril"></div>
                    <div id="rightNostril"></div>
                  </div>
                  <div id="mouthArea">
                    <div id="mouth"></div>
                  </div>
                </div>
              </div>

              <div id="armsArea">
                <div class="arms leftArmPosition" id="leftArm">
                  <div class="hand"></div>
                </div>
                <div class="arms rightArmPosition" id="rightArm">
                  <div class="hand"></div>
                </div>
              </div>

              <div id="feetArea">
                <div class="feet" id="leftFoot"></div>
                <div class="feet" id="rightFoot"></div>
              </div>
            </div>
          </div>

          <br />

          <div class="dnaDiv" id="monkeyDNA">
            <b>
              DNA:
              <!-- Colors -->
              <span id="dnabody"></span>
              <span id="dnamouth"></span>
              <span id="dnaeyes"></span>
              <span id="dnaears"></span>

              <!-- monkeyAttributes -->
              <span id="dnaEyeShape"></span>
              <span id="dnaMouthShape"></span>
              <span id="dnaEyeBackgroundColor"></span>
              <span id="dnaLowerHeadColor"></span>
              <span id="dnaAnimation"></span>
              <span id="dnaspecial"></span>
            </b>
          </div>      
              
        </div>
      `
    );
  }*/

  /*
  $("#monkeyBox1").html(`DNA: <a href=''> ${} </a> `);
  $("#monkeyBox1DNA").html(`DNA: <a href=''> ${usdFormatter.format(Math.round(firstRowDataOutput.data.total_market_cap.usd))} </a> `);
  */
  // and create the next box right next to it..
  // until all boxes are displayed
});
