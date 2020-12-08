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

  console.log("galleryjs instance: ");
  console.log(instance);
  console.log("user: " + user);
  console.log("accounts[0]: " + accounts[0]);

  var userBalance = await instance.methods.balanceOf(user).call();
  console.log(`user has ${userBalance} Crypto Monkeys`);

  // return a new array, where you get all the tokenIds
  let myMonkeyIdsArray = await instance.methods.findAllMyMonkeyIds(user).call();       
  console.log("myMonkeyIdsArray: ");
  console.log(myMonkeyIdsArray);
  console.log("myMonkeyIdsArray[0]: ");
  console.log(myMonkeyIdsArray[0]);


      
  const events = await instance.getPastEvents("MonkeyCreated", {
    fromBlock: 0,
    toBlock:"latest",
  });

  console.log("MonkeyCreated Events emitted: ");
  console.log(events);


  
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

           
  for (let j = 0; j < userBalance; j++) {
    const tokenIdtemp = myMonkeyIdsArray[j];
    let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenIdtemp).call(); 
    console.log("for loop is running");
    console.log("myMonkeyIdsArray Position" + j);
    console.log(myCryptoMonkey);

    console.log("Token ID: " + myMonkeyIdsArray[j]); 

    console.log("approvedAddress " + myCryptoMonkey.approvedAddress);

    console.log("birthtime " + myCryptoMonkey.birthtime);

    console.log("generation " + myCryptoMonkey.generation);

    console.log("genes " + myCryptoMonkey.genes);

    console.log("owner " + myCryptoMonkey.owner);

    console.log("parent1Id " + myCryptoMonkey.parent1Id);

    console.log("parent2Id " + myCryptoMonkey.parent2Id);

  };

});



/*
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

  
  /*
  for (let index = 0; index < myMonkeyIdsArray.length; index++) {

    let monkey = myMonkeyIdsArray[index];    

    $("#monkeyList").append(buildMonkeyBoxes(monkey));
        
  }

  
  
  function buildMonkeyBoxes(tokenId) {    
    return   
    `
      <div id="cryptoMonkey${tokenId}" class="monkeyBox${tokenId} m-2 light-b-shadow">       
        <div id="monkey${tokenId}">
          <div id="mbody${tokenId}">
            <div id="mHead${tokenId}">
              <div id="earsArea${tokenId}">
                <div class="ears" id="ear-left${tokenId}"></div>
                <div class="ears" id="ear-right${tokenId}"></div>
              </div>

              <div id="mHeadTop${tokenId}">
                <div id="eyesArea${tokenId}">

                  <div class="aroundEyesClass">
                    <div class="eyes" id="leftEye${tokenId}">
                      <span><div class="pupil${tokenId}"></div></span>
                    </div>
                  </div>

                  <div class="aroundEyesClass">
                    <div class="eyes" id="rightEye${tokenId}">
                      <span><div class="pupil${tokenId}"></div></span>
                    </div>

                  </div>
                </div>
              </div>

              <div id="mHeadLower${tokenId}">
                <div id="noseArea${tokenId}">
                  <div id="leftNostril${tokenId}"></div>
                  <div id="rightNostril${tokenId}"></div>
                </div>
                <div id="mouthArea${tokenId}">
                  <div id="mouth${tokenId}"></div>
                </div>
              </div>
            </div>

            <div id="armsArea${tokenId}">
              <div class="arms leftArmPosition" id="leftArm${tokenId}">
                
              </div>
              <div class="arms rightArmPosition" id="rightArm${tokenId}">
                
              </div>
            </div>

            <div id="feetArea${tokenId}">
              <div class="feet" id="leftFoot${tokenId}"></div>
              <div class="feet" id="rightFoot${tokenId}"></div>
            </div>
          </div>
        </div>

        <br />

        <div class="dnaDiv" id="monkeyDNA${tokenId}">
          <b>
            DNA:
            <!-- Colors -->
            <span id="dnabody${tokenId}"></span>
            <span id="dnamouth${tokenId}"></span>
            <span id="dnaeyes${tokenId}"></span>
            <span id="dnaears${tokenId}"></span>

            <!-- monkeyAttributes -->
            <span id="dnaEyeShape${tokenId}"></span>
            <span id="dnaMouthShape${tokenId}"></span>
            <span id="dnaEyeBackgroundColor${tokenId}"></span>
            <span id="dnaLowerHeadColor${tokenId}"></span>
            <span id="dnaAnimation${tokenId}"></span>
            <span id="dnaspecial${tokenId}"></span>
          </b>
        </div>      
            
      </div>
    `     
   
    // need to create a for loop here, to cycle through all tokenIds from myMonkeyIdsArray

    // displayAllMonkeys 

    // $("#monkeyList").append( displayAllMonkeys(tokenId)   );

  } 
  // and create the next box right next to it..
  // until all boxes are displayed

*/
