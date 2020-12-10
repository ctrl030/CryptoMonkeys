var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0xF2Fa4984E85fDCc906531f7E804cffc17B663c55";

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

/*
function buildMonkeyBoxes(tokenId) {    
  return `
  
  `     
}  
*/


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


