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

  // console.log("indexjs instance: ");
  // console.log(instance);
  console.log("user: " + user);
  // console.log("accounts[0]: " + accounts[0]);

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
      $("#monkeyCreatedDiv").css("display", "flex");
      $("#monkeyCreatedDiv").empty();
      $("#monkeyCreatedDiv").append(
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


// listens to button click, then creates dnsStr (same format as genes) from concatting all the already set css values
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

// Gallery Part



$("#switchToGalleryButton").click(() => {
  $("#switchToGalleryButton").hide();
  $("#switchToCreationButton").show();  
});

$("#switchToCreationButton").click(() => {
  $("#switchToCreationButton").hide();  
  $("#switchToGalleryButton").show();
  
});

/*
// return a new array, where you get all the tokenIds
let myMonkeyIdsArray = await instance.methods.findAllMyMonkeyIds(user).call();       
console.log("myMonkeyIdsArray: ");
console.log(myMonkeyIdsArray);

console.log("myMonkeyIdsArray[0]: ");
console.log(myMonkeyIdsArray[0]);
*/

/*
for (let j = 0; j < userBalance; j++) {
  const tokenId = myMonkeyIdsArray[j];
  let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call(); 
  
  console.log("for loop is running");
  console.log("myMonkeyIdsArray Position" + j);
  console.log(myCryptoMonkey);
  

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
  



  $("#monkeyList").append(buildMonkeyBoxes(tokenId));

  console.log("apppend should have fired here")

  renderMonkey(tokenIdDNA);

};
*/


