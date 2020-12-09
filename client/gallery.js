var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x5046d36207613E66e3cB14BCE29c8f2cF3e37Ab4";

$(document).ready(async function () {
 

  var accounts = await window.ethereum.enable();

  instance = new web3.eth.Contract(abi, contractAddress, {
    from: accounts[0],
  });

  user = accounts[0];

  /*
  console.log("galleryjs instance: ");
  console.log(instance);
  */
  console.log("user: " + user);
  /*
  console.log("accounts[0]: " + accounts[0]);
  */

  var userBalance = await instance.methods.balanceOf(user).call();
  console.log(`user has ${userBalance} Crypto Monkeys`);

  // return a new array, where you get all the tokenIds
  let myMonkeyIdsArray = await instance.methods.findAllMyMonkeyIds(user).call();       
  console.log("myMonkeyIdsArray: ");
  console.log(myMonkeyIdsArray);
  /*
  console.log("myMonkeyIdsArray[0]: ");
  console.log(myMonkeyIdsArray[0]);
  */


  for (let j = 0; j < userBalance; j++) {
    const tokenId = myMonkeyIdsArray[j];
    let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call(); 
    /*
    console.log("for loop is running");
    console.log("myMonkeyIdsArray Position" + j);
    console.log(myCryptoMonkey);
    */

    console.log("Token ID: " + tokenId); 

    console.log("approvedAddress " + myCryptoMonkey.approvedAddress);

    console.log("birthtime " + myCryptoMonkey.birthtime);

    console.log("generation " + myCryptoMonkey.generation);

    console.log("genes " + myCryptoMonkey.genes);

    console.log("owner " + myCryptoMonkey.owner);

    console.log("parent1Id " + myCryptoMonkey.parent1Id);

    console.log("parent2Id " + myCryptoMonkey.parent2Id);

    let tokenIdGenes = myCryptoMonkey.genes.toString();

    console.log("tokenIdGenes " + tokenIdGenes);

    var tokenIdHeadcolor = Number(tokenIdGenes.charAt(0)+tokenIdGenes.charAt(1));
    var tokenIdmouthcolor = Number(tokenIdGenes.charAt(2)+tokenIdGenes.charAt(3));
    var tokenIdeyescolor = Number(tokenIdGenes.charAt(4)+tokenIdGenes.charAt(5));
    var tokenIdearscolor = Number(tokenIdGenes.charAt(6)+tokenIdGenes.charAt(7));
  
    var tokenIdeyesShape = Number(tokenIdGenes.charAt(8));
    var tokenIdmouthShape = Number(tokenIdGenes.charAt(9));
  
    var tokenIdeyeBackgroundColor = Number(tokenIdGenes.charAt(10)+tokenIdGenes.charAt(11));
    var tokenIdlowerHeadColor = Number(tokenIdGenes.charAt(12)+tokenIdGenes.charAt(13));
  
    var tokenIdanimation = Number(tokenIdGenes.charAt(14));
    var tokenIdlastNum = Number(tokenIdGenes.charAt(15));
  
    var tokenIdDNA = {
      headcolor: tokenIdHeadcolor,
      mouthcolor: tokenIdmouthcolor,
      eyescolor: tokenIdeyescolor,
      earscolor: tokenIdearscolor,
    
      eyesShape: tokenIdeyesShape,
      mouthShape: tokenIdmouthShape,
      eyeBackgroundColor: tokenIdeyeBackgroundColor,
      lowerHeadColor: tokenIdlowerHeadColor,
      animation: tokenIdanimation,
      lastNum: tokenIdlastNum,
    };
    console.log("tokenIdDNA ");
    console.log(tokenIdDNA);
    /*
    toString()
    charAt(0)
    Number()
    */



    $("#monkeyList").append(buildMonkeyBoxes(tokenId));

    console.log("apppend should have fired here")

    renderMonkey(tokenIdDNA);

  };


});

/*

function defineTokenIdMonkey(tokenId) {
  var tokenIdHeadcolor = Math.floor(Math.random() * 89) + 10;
  var tokenIdmouthcolor = Math.floor(Math.random() * 89) + 10;
  var tokenIdeyescolor = Math.floor(Math.random() * 89) + 10;
  var tokenIdearscolor = Math.floor(Math.random() * 89) + 10;

  var tokenIdeyesShape = Math.floor(Math.random() * 7) + 1;
  var tokenIdmouthShape = Math.floor(Math.random() * 7) + 1;

  var tokenIdeyeBackgroundColor = Math.floor(Math.random() * 89) + 10;
  var tokenIdlowerHeadColor = Math.floor(Math.random() * 89) + 10;

  var tokenIdanimation = Math.floor(Math.random() * 7) + 1;
  var tokenIdlastNum = Math.floor(Math.random() * 7) + 1;

  var tokenId${tokenId}DNA = {
    headcolor: tokenIdHeadcolor,
    mouthcolor: tokenIdmouthcolor,
    eyescolor: tokenIdeyescolor,
    earscolor: tokenIdearscolor,
  
    eyesShape: tokenIdeyesShape,
    mouthShape: tokenIdmouthShape,
    eyeBackgroundColor: tokenIdeyeBackgroundColor,
    lowerHeadColor: tokenIdlowerHeadColor,
    animation: tokenIdanimation,
    lastNum: tokenIdlastNum,
  };

  // create random DNA variable, create keys and calculate values and assign values to keys
  // then run renderMonkey(randomDNA);
  renderMonkey(tokenId);
}*/

// each time, each box should:
// create own set of variables (standard plus tokenID) :
//  -css(own values that stay stable and that its own rendering will then refer to, must also be set) 
//  -and html(naming inside the div) 
// read the genes and from these
// save values to own set of css 


function buildMonkeyBoxes(tokenId) {    
  return `
  <div id="cryptoMonkey cryptoMonkey${tokenId}" class="monkeyBox monkeyBox${tokenId} m-2 light-b-shadow">       
    <div id="monkey monkey${tokenId}">
      <div id="mbody mbody${tokenId}">
        <div id="mHead mHead${tokenId}">
          <div id="earsArea earsArea${tokenId}">
            <div class="ears ears${tokenId}" id="ear-left ear-left${tokenId}"></div>
            <div class="ears ears${tokenId}" id="ear-right ear-right${tokenId}"></div>
          </div>

          <div id="mHeadTop mHeadTop${tokenId}">
            <div id="eyesArea eyesArea${tokenId}">

              <div class="aroundEyesClass aroundEyesClass${tokenId}">
                <div class="eyes eyes${tokenId}" id="leftEye leftEye${tokenId}">
                  <span><div class="pupil pupil${tokenId}"></div></span>
                </div>
              </div>

              <div class="aroundEyesClass aroundEyesClass${tokenId}">
                <div class="eyes" id="rightEye rightEye${tokenId}">
                  <span><div class="pupil pupil${tokenId}"></div></span>
                </div>

              </div>
            </div>
          </div>

          <div id="mHeadLower mHeadLower${tokenId}">
            <div id="noseArea noseArea${tokenId}">
              <div id="leftNostril leftNostril${tokenId}"></div>
              <div id="rightNostril rightNostril${tokenId}"></div>
            </div>
            <div id="mouthArea mouthArea${tokenId}">
              <div id="mouth mouth${tokenId}"></div>
            </div>
          </div>
        </div>

        <div id="armsArea armsArea${tokenId}">
          <div class="arms arms${tokenId} leftArmPosition leftArmPosition${tokenId}" id="leftArm leftArm${tokenId}">
            
          </div>
          <div class="arms arms${tokenId} rightArmPosition rightArmPosition${tokenId}" id="rightArm$ rightArm${tokenId}">
            
          </div>
        </div>

        <div id="feetArea feetArea${tokenId}">
          <div class="feet feet${tokenId}" id="leftFoot leftFoot${tokenId}"></div>
          <div class="feet feet${tokenId}" id="rightFoot rightFoot${tokenId}"></div>
        </div>
      </div>
    </div>

    <br />

    <div class="dnaDiv "dnaDiv${tokenId}" id="monkeyDNA monkeyDNA${tokenId}">
      <b>
        DNA:
        <!-- Colors -->
        <span id="dnabody dnabody${tokenId}"></span>
        <span id="dnamouth dnamouth${tokenId}"></span>
        <span id="dnaeyes dnaeyes${tokenId}"></span>
        <span id="dnaears dnaears${tokenId}"></span>

        <!-- monkeyAttributes -->
        <span id="dnaEyeShape dnaEyeShape${tokenId}"></span>
        <span id="dnaMouthShape dnaMouthShape${tokenId}"></span>
        <span id="dnaEyeBackgroundColor dnaEyeBackgroundColor${tokenId}"></span>
        <span id="dnaLowerHeadColor dnaLowerHeadColor${tokenId}"></span>
        <span id="dnaAnimation dnaAnimation${tokenId}"></span>
        <span id="dnaspecial dnaspecial${tokenId}"></span>
      </b>
    </div>      
        
  </div>
  `     
}  



/*
function buildMonkeyBoxes(tokenId) {    
  return   
  
}  


*/




//good, implement later
      /*
      const events = await instance.getPastEvents("MonkeyCreated", {
      fromBlock: 0,
      toBlock:"latest",
      });

      console.log("MonkeyCreated Events emitted: ");
      console.log(events);
*/

  
// DONE implement: return a new array, where you get all the tokenIds : let myMonkeyIdsArray = await instance.methods.findAllMyMonkeyIds(user).call();     
  // and run tokenIds through the global variable that holds the monkey structs, and get the whole monkey
  // and from these create the new array, and return THAT

  /*
    getMonkeyDetails(uint256 tokenId)
    uint256 genes,
    uint256 birthtime,
    uint256 parent1Id,
    uint256 parent2Id,
    uint256 generation,
    address owner,
    address approvedAddress  
  */

           
  




/*



    build a box function
    like the kitty apppends 




 // creating a box
  // querying the DNA from the blockchain, from an array, start with position 1 , think about how to fill position zero
  // running the DNA string as arguments to showing the monkey in the box
  // now add this all to the html

  // var usersMonkeys = [];



    instance
      .getPastEvents("MonkeyCreated", function (error, events) {
        console.log(events);
      })
      .on("data", function (event) {
        console.log(event);
        let owner = event.returnValues.owner;
        let tokenId = event.returnValues.tokenId;
        let parent1Id = event.returnValues.parent1Id;
        let parent2Id = event.returnValues.parent2Id;
        let genes = event.returnValues.genes
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
  */

  
  

  // need to create a for loop here, to cycle through all tokenIds from myMonkeyIdsArray

    // displayAllMonkeys 

    // $("#monkeyList").append( displayAllMonkeys(tokenId)   );

  
  // and create the next box right next to it..
  // until all boxes are displayed


