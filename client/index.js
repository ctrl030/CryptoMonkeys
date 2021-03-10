// Connecting with Web3.js functionalities
var web3 = new Web3(Web3.givenProvider);

// This "instance" variable is a representation of the smart contract
var instance;

// xxx for marketplace
var marketInstance;

// User1 will be set to the correct account from Ganache (it's necessary to log in to this account via Metamask)
var user1;

/*F
// xxx for marketplace
var user2;
*/

// Contract address for main contract, has to be updated when migrating => i.e. contract address is changing
var contractAddress = "0x932dA8a6c2502b07D7211868da81e65415FcCEEB";

// Contract address for marketplace contract, has to be updated when migrating => i.e. contract address is changing
var marketContractAddress = "0x3134C3A1524989ACEa70cdf8af665971662B6e05";

var accounts;

// When ready, during page load 
$(document).ready(async function () {

  // Enabling / connecting with Ganache accounts
  accounts = await window.ethereum.enable();

  // Setting the representation of the main smart contract, specifying abi, contractAddress and first account from Ganache's list at this moment
  instance = new web3.eth.Contract(abi, contractAddress, {
    from: accounts[0],
  });


  // Setting user to first account from Ganache's list at this moment
  user1 = accounts[0];

  // To check in console if user is correct (shown in Metamask to be the same, for ex.)
  console.log("user1: " + user1); 

  // on pageload we subscribe to the MonkeyCreated event. From now on, whenever it is emitted, 
  // a notification is created and the css of the monkeyCreatedDiv will be emptied and then appended with the info
  // This only reacts to MonkeyCreated events triggered by "instance", which is specified to "from: accounts[0]"
  // I.e. only this user's created monkeys will trigger it.
  instance.events
    .MonkeyCreated()
    .on("data", function (event) {
      console.log(event);
      let owner = event.returnValues.owner;
      console.log(owner);
      console.log(user1);
      // check if both addresses are the same (also use checksum because of format), if not same, don't show to this user (CMO created by other user)
      if (web3.utils.toChecksumAddress(owner) != web3.utils.toChecksumAddress(user1)) {
        return;
      }
      let tokenId = event.returnValues.tokenId;
      let parent1Id = event.returnValues.parent1Id;
      let parent2Id = event.returnValues.parent2Id;
      let genes = event.returnValues.genes;
      $("#monkeyCreatedDiv").css("display", "flex");
      $("#monkeyCreatedDiv").empty();
      $("#monkeyCreatedDiv").append(
        `        
          <ul id="monkeyCreatedDivUnorderedList">
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
  
  

  instance.events
    .BreedingSuccessful()
    .on("data", function (event) {
      console.log(event);      
      let tokenId = event.returnValues.tokenId;      
      let generation = event.returnValues.generation;
      let genes = event.returnValues.genes;
      let owner = event.returnValues.owner;
      let parent1Id = event.returnValues.parent1Id;
      let parent2Id = event.returnValues.parent2Id;
      showLastBornChildMonkey(tokenId);
      $("#monkeyMultipliedSuccessDiv").css("display", "flex");
      $("#monkeyMultipliedSuccessDiv").empty();
      $("#monkeyMultipliedSuccessDiv").append(
        `        
          <ul id="breedingSuccessfulDivUnorderedList">
            <li>Crypto Monkey breeding successfully!</li>
            <li>Here are the details: </li>
            <li>tokenId:  ${tokenId}</li>  
            <li>generation: ${generation}</li>
            <li>genes: ${genes}</li>
            <li>owner:  ${owner}</li>            
            <li>parent1Id: ${parent1Id}</li>
            <li>parent2Id: ${parent2Id}</li>            
          </ul>
        `
      );
    })
    .on("error", function (error) {
      console.log(error);
  });

});




// 
$("#switchToMarketButton").click( async () => { 
  // hides breeding functionalities
  hideBreedingElements();  
  // hides creation functionalities
  $("#monkeyRowCreation").hide();
  $("#buttonHolderArea").hide();  
  // emptying gallery
  $("#monkeyRowGallery").empty();     

  //resetting market
  hideMarketElements();
 
  $("#marketRow").css("display", "block"); 

  $("#marketButtonHolderArea").css("display", "flex");   

  $("#marketButtonHolderArea").show();
  
  
  

  // Setting the representation of the market smart contract, specifying abi, contractAddress and first account from Ganache's list at this moment
  marketInstance = new web3.eth.Contract(marketAbi, marketContractAddress, {
    from: accounts[0],
  });  
  console.log("marketInstance is");
  console.log(marketInstance);  

  marketInstance.events
    .MarketTransaction()
    .on("data", function (event) {
      console.log(event);
      $("#marketActivityDiv").css("display", "flex");
      $("#marketActivityDiv").empty();
      $("#marketActivityDiv").append(
        `        
          Market activity registered. Click "Market" again to refresh the offers. 
        `
      );
    })
    .on("error", function (error) {
      console.log(error);
  });
  /*
  
  append button holder area with 3 buttons and 1 field: show offer + tokenId field, sell, my offers
    if you click on show offer, 
      must have filled out field with tokenId
      empty all offers
      show only selected offer (offerbox)
      show new instructions 
      2 buttons: buy (metamask will open with payment), back (back to all offers, same as clicking on buy before, emptying) 
      

    if you click on sell
      empty all offers
      show all monkeys you own
      append button holder area with 2 fields and 1 button: tokenId and price, create offer

    if you click on my offers
      show all your offers (offerboxes)

  text explainer box with instructions how to use

  load all offers atm and show (offerboxes)



  need:

  different kind of monkey boxes
    offerboxes  */

  /*
  user2 = accounts[1];
  console.log("user2 is " + user2);
  */  
});

// XXXX
$("#showUsersOffersButton").click( async () => { 
  
  // XXX BUYING FUNCTIONALITY - USERS ACTIVE OFFERS

  // offersArrayRaw still includes inactive offers (offers for tokenId 0 )
  var offersArrayRaw = await marketInstance.methods.getAllTokenOnSale().call();
  console.log("Offers Array including inactive offers: ");
  console.log(offersArrayRaw);

  // Array of tokenIds for which an active order exists 
  var offerTokenIdsArray;

  // Array of the complete offers
  var completeOffersArray;

  for (let index = 0; index < offersArrayRaw.length; index++) {
    const tokenId = offersArrayRaw[index];
    // filtering out inactive offers
    if (tokenId != 0) {
      // adding active offers to offerTokenIdsArray
      offerTokenIdsArray.push(tokenId);

      // querying the complete offer for this tokenId from the blockchain
      var completeOffer = await marketInstance.methods.getOffer(tokenId).call(); 

      // adding all active, complete offers to completeOffersArray
      completeOffersArray.push(completeOffer);

      var offerPrice = completeOffer.price;

      var offerOwner = completeOffer.seller;

      if (offerOwner.length > 18) {
        offerOwner = offerOwner.substring(0, 17) + "...";
      }

      var monkeyInOffer = await instance.methods.getMonkeyDetails(tokenId).call();

      const dnaObject = await decipherDNAtoObject(monkeyInOffer);   

      const tokenGeneration = monkeyInOffer.generation;

      const boxtype = "offerBox";

      // Call to create and append HTML for each offer, marks built monkeyboxes with class boxtype, i.e. "offerBox"
      $("#monkeyDisplayArea").append(buildMonkeyBoxes(tokenId, boxtype)); 
          
      console.log("tokenIdDNA: ");
      console.log(dnaObject);   

      $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

      $(`#offerPriceDisplayLine${tokenId}`).html(offerPrice);

      $(`#offerOwnerDisplayLine${tokenId}`).html(offerOwner); 

      
      // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
      // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
      renderMonkey(dnaObject, tokenId);
      
      showPrices(tokenId);

    }    
  }

  console.log("Active offers exist for these tokenIds: ");
  console.log(offerTokenIdsArray);
});



$("#showSellAreaButton").click( async () => { 

  $("#offerButtonHolderArea").css("display", "flex");  

  $("#offerButtonHolderArea").show(); 
  $(`#monkeyDisplayArea`).empty();

  galleryLogic(`#monkeyDisplayArea`);

  

  /*
    
    // Looping through the user's tokenIds and for each:
    // reading the "DNA string",
    // creating the correct CSS data from it
    // creating an unique HTML structure in the gallery 
    // applying the CSS to it

    for (let m = 0; m < userBalance; m++) {
      const offer = offersArray[m];
      let myCryptoMonkey = await instance.methods.getMonkeyDetails(offer).call();
      const dnaObject = await decipherDNAtoObject(myCryptoMonkey);   

      const tokenGeneration = myCryptoMonkey.generation;

      // Call to create and append HTML for each cryptomonkey of the connected user
      $("#marketRow").append(buildMonkeyBoxes(tokenId));

      $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

      console.log("tokenIdDNA: ");
      console.log(dnaObject);   

      // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
      // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
      renderMonkey(dnaObject, tokenId);      


    }; 
  });

  */ 

});

// XXXXX
function showPrices(tokenId) {
  $(`#monkeyBox${tokenId}.monkey`).css("top", "29%");  

  $(`#monkeyTokenIdDiv${tokenId}`).css("bottom", "130px");

  $(`#monkeyGenerationDiv${tokenId}`).css("bottom", "100px");

  $(`#monkeyDNALine${tokenId}`).css("bottom", "70px");  

  $(`#offerPriceDiv${tokenId}`).css("display", "flex"); 

  $(`#offerOwnerDiv${tokenId}`).css("display", "flex"); 
}

function withoutPrices() {
  $(`.monkey`).css("top", "32%");  

  $(`.monkeyTokenIdDiv`).css("bottom", "70px");

  $(`#monkeyGenerationDiv`).css("bottom", "40px");

  $(`#monkeyDNALine`).css("bottom", "10px");  

  $(`#offerPriceDiv`).css("display", "none"); 

  $(`#offerOwnerDiv`).css("display", "none");
}

$("#showBuyAreaButton").click( async () => { 

  //resetting market
  hideMarketElements(); 
  $("#marketRow").css("display", "block"); 
  $("#marketButtonHolderArea").css("display", "flex");   
  $("#marketButtonHolderArea").show();
  
  // XXX BUYING FUNCTIONALITY - ALL ACTIVE OFFERS
  // offersArrayRaw still includes inactive offers (offers for tokenId 0 )
  var offersArrayRaw = await marketInstance.methods.getAllTokenOnSale().call();
  console.log("Offers Array including zero monkey: ");
  console.log(offersArrayRaw);

  // Array of tokenIds for which an active order exists 
  var offerTokenIdsArray = [];

  // Array of the complete offers
  var completeOffersArray = [];

  for (let index = 0; index < offersArrayRaw.length; index++) {
    const tokenId = offersArrayRaw[index];
    // filtering out zero monkey
    if (tokenId != 0) {
      // adding active offers to offerTokenIdsArray
      offerTokenIdsArray.push(tokenId);

      // querying the complete offer for this tokenId from the blockchain
      var completeOffer = await marketInstance.methods.getOffer(tokenId).call(); 

      // adding all active, complete offers to completeOffersArray
      completeOffersArray.push(completeOffer);

      var offerPrice = completeOffer.price;

      var offerOwner = completeOffer.seller;

      if (offerOwner.length > 18) {
        offerOwner = offerOwner.substring(0, 17) + "...";
      }

      var monkeyInOffer = await instance.methods.getMonkeyDetails(tokenId).call();

      const dnaObject = await decipherDNAtoObject(monkeyInOffer);   

      const tokenGeneration = monkeyInOffer.generation;

      const boxtype = "offerBox";

      // Call to create and append HTML for each offer, marks built monkeyboxes with class boxtype, i.e. "offerBox"
      $("#monkeyDisplayArea").append(buildMonkeyBoxes(tokenId, boxtype)); 
          
      console.log("tokenIdDNA: ");
      console.log(dnaObject);   


      $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

      $(`#offerPriceDisplayLine${tokenId}`).html(offerPrice);

      $(`#offerOwnerDisplayLine${tokenId}`).html(offerOwner); 
      
      // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
      // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
      renderMonkey(dnaObject, tokenId);
      
      showPrices(tokenId);

    }    
  }

  console.log("Active offers exist for these tokenIds: ");
  console.log(offerTokenIdsArray);

}); 








// Listens to button click, then creates dnsStr (16 digits number string, same format as genes) 
// from concatting all the already set css values
// then calls the contract's createGen0Monkey function and mints a Crypto Monkey that contains this string 
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

function hideBreedingElements() {
  $("#parentsArea").empty();
  $("#parentsArea").css("display", "none");
  $("#childArea").empty();
  $("#childArea").css("display", "none");
  $("#multiplyButtonHolderArea").hide();
  $("#monkeyMultipliedSuccessDiv").hide();
  $("#monkeyRowMultiply").hide();  
}

function hideMarketElements() {  
  $("#marketRow").css("display", "none"); 
  $("#marketButtonHolderArea").css("display", "none"); 
  $("#offerButtonHolderArea").css("display", "none");
  $("#monkeyDisplayArea").empty();   
  $("#chooseMonkeyForOfferInputField").val("");
  $("#choosePriceForOfferInputField").val("");  
}

// XXXX 
$("#makeMarketOperatorButton").click(async () => {  
  let setOperatorRequest = await instance.methods.setApprovalForAll(marketContractAddress, true).send();
  console.log(setOperatorRequest);
});

let tokenIdToCreateOffer;
let priceToCreateOfferInWEI; 

// XXXX
$("#createOfferButton").click(async () => {  

  tokenIdToCreateOffer = /*BigInt(*/$("#offerTokenIdInputField").val()/*)*/; 
  console.log(tokenIdToCreateOffer);

  priceToCreateOfferInWEI = /*BigInt(*/(10**18)* $("#offerPriceInputField").val()/*)*/;   
  console.log(priceToCreateOfferInWEI);

  await marketInstance.methods.setOffer(priceToCreateOfferInWEI, tokenIdToCreateOffer).send();


});


// Button to monkey creation
$("#switchToCreationButton").click(() => {  

  $("#monkeyRowCreation").show();
  $("#buttonHolderArea").show();

  // hides breeding functionalities
  hideBreedingElements(); 

  // emptying market 
  hideMarketElements(); 

  //emptying gallery
  $("#monkeyRowGallery").empty(); 
});

// Button to breeding area
$("#switchToMultiplyButton").click(() => {
  switchToMultiply()   
});

$("#backToMultiplyButton").click(() => {
  switchToMultiply()
});



function switchToMultiply() {
  hideBreedingElements();  
  // shows breeding functionalities
  $("#multiplyButtonHolderArea").css("display", "flex");  
  $("#multiplyButtonHolderArea").show(); 
  $("#makeMoreMonkeysButton").hide();   
  $("#showParentsButton").show();  

  $("#parent1InputField").val("");
  $("#parent2InputField").val("");
  $("#parent1InputField").show(); 
  $("#parent2InputField").show(); 

  $("#backToMultiplyButton").hide(); 
  $("#parentsArea").empty();
  $("#childArea").empty();  
    

  // hides creation functionalities
  $("#monkeyRowCreation").hide();
  $("#buttonHolderArea").hide();  

  // emptying market
  hideMarketElements(); 

  //emptying gallery
  $("#monkeyRowGallery").empty();
}



var parent1Input;
var parent2Input;


$("#makeMoreMonkeysButton").click(async () => { 
  await instance.methods.breed(parent1Input, parent2Input).send();

  // let newDetails = await instance.methods.getMonkeyDetails(newMonkeyTokenId).call();

  // console.log(newDetails);

});

async function showLastBornChildMonkey(tokenId) {
  $("#childArea").empty(); 
  $("#childArea").show();  

  let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call();

  const dnaObject = await decipherDNAtoObject(myCryptoMonkey); 

  const tokenGeneration = myCryptoMonkey.generation; 

  // Call to create and append HTML 
  $("#childArea").append(buildMonkeyBoxes(tokenId));  

  $(`#childArea #generationDisplayLine${tokenId}`).html(tokenGeneration);
                       
  console.log("tokenIdDNA: ");
  console.log(dnaObject);   

  // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
  // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
  renderMonkey(dnaObject, tokenId);         
}




$("#showParentsButton").click(async () => {
  
 parent1Input = $("#parent1InputField").val();
 parent2Input = $("#parent2InputField").val();

 // userBalance will be the number of monkeys the user has
 var userBalance = await instance.methods.balanceOf(user1).call();
 console.log(`user1 has ${userBalance} Crypto Monkeys`);

 // An array that holds all of the user's tokenIds
 let myMonkeyIdsArray = await instance.methods.findMonkeyIdsOfAddress(user1).call();       
 console.log("myMonkeyIdsArray: ");
 console.log(myMonkeyIdsArray);

 var parent1IsOwnedBool = false;
 var parent2IsOwnedBool = false;

 for (let index = 0; index < myMonkeyIdsArray.length; index++) {

  const monkeyToCheckAgainst = myMonkeyIdsArray[index];  

  if (monkeyToCheckAgainst == parent1Input) {
    parent1IsOwnedBool = true;
  }

  if (monkeyToCheckAgainst == parent2Input) {
    parent2IsOwnedBool = true;
  }
   
 }

 if (parent1Input == 0 || parent2Input == 0) { 
   alert("Put in both parents' Token IDs")   
  } 
 else if (parent1IsOwnedBool == false || parent2IsOwnedBool == false) {
    alert("You must own both parent monkeys, check gallery")
  } 
  else if (parent1Input == parent2Input) { 
    alert("Must be 2 different monkeys you own")   
  }
  else {      
    $("#monkeyRowMultiply").css("display", "flex");    
    $("#childArea").hide(); 
    $("#backToMultiplyButton").show();    
    $("#makeMoreMonkeysButton").show();
    $("#showParentsButton").hide();

    $("#parentsArea").empty();
    $("#parentsArea").css("display", "flex");   
    $("#parent1InputField").hide();  
    $("#parent2InputField").hide(); 

    console.log(parent1Input);
    console.log(parent2Input);   

    var myIncomingmonkeyIdsArray = [parent1Input, parent2Input];

    for (let j = 0; j < 2; j++) {
      const tokenId = myIncomingmonkeyIdsArray[j];

      let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call();

      const dnaObject = await decipherDNAtoObject(myCryptoMonkey); 

      const tokenGeneration = myCryptoMonkey.generation;
      
      // Call to create and append HTML for each cryptomonkey of the connected user
      $("#parentsArea").append(buildMonkeyBoxes(tokenId));  

      $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

      console.log("tokenIdDNA: ");
      console.log(dnaObject);   
  
      // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
      // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
      renderMonkey(dnaObject, tokenId);         
      
      
    };

  };
  

});

async function decipherDNAtoObject(myCryptoMonkey) {    
      
  // The 16 digit "DNA string" is turned into a string, then from the digit's position,
  // the correct CSS variables are created  
  let tokenIdGenes = myCryptoMonkey.genes.toString();  
  // console.log("tokenIdGenes " + tokenIdGenes);
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

  // The CSS variables are saved into a single variable each time, which is passed on
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

  return tokenIdDNA;
}







// Button to gallery 
// the creation part is hidden 
// and the contract is queried on the blockchain, then data is fetched and displayed
$("#switchToGalleryButton").click(async () => {  
  // emptying gallery
  $("#monkeyRowGallery").empty();   
  // emptying market  
  hideMarketElements(); 
  
  // hides breeding functionalities
  hideBreedingElements();

  // hides creation functionalities
  $("#monkeyRowCreation").hide();
  $("#buttonHolderArea").hide();  

  galleryLogic(`#monkeyRowGallery`);

});

async function galleryLogic(divToAppendTo) {
  // userBalance will be the number of monkeys the user has
  var userBalance = await instance.methods.balanceOf(user1).call();
  console.log(`user1 has ${userBalance} Crypto Monkeys`);

  // An array that holds all of user1's tokenIds
  let myMonkeyIdsArray = await instance.methods.findMonkeyIdsOfAddress(user1).call();       
  console.log("myMonkeyIdsArray: ");
  console.log(myMonkeyIdsArray);
  
  // Looping through the user's tokenIds and for each:
  // reading the "DNA string",
  // creating the correct CSS data from it
  // creating an unique HTML structure in the gallery 
  // applying the CSS to it

  for (let j = 0; j < userBalance; j++) {
    const tokenId = myMonkeyIdsArray[j];
    let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call();
    const dnaObject = await decipherDNAtoObject(myCryptoMonkey);   

    const tokenGeneration = myCryptoMonkey.generation;

    // Call to create and append HTML for each cryptomonkey of the connected user
    $(`${divToAppendTo}`).append(buildMonkeyBoxes(tokenId));

    $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

    console.log("tokenIdDNA: ");
    console.log(dnaObject);   

    // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
    // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
    renderMonkey(dnaObject, tokenId);  

  }; 
}


// Procedurally creating an HTML structure for each cryptomonkey of the connected user
// Note: Each monkeyBox has the monkeys tokenId concatted into its unique id, for saving, styling and accessing,
// and also the DNA variables are named uniquely with the tokenId
function buildMonkeyBoxes(tokenId, boxtype="") {    

  console.log("tokenId incoming: " + tokenId);

  return `
  <div class="monkeyBox ${boxtype} m-2 light-b-shadow" id="monkeyBox${tokenId}">
    <div class="monkey" id="monkey">
      <div id="mbody">
        <div id="mHead">
          <div id="earsArea">
            <div class="ears" id="ear-left"></div>
            <div class="ears" id="ear-right"></div>
          </div>

          <div id="mHeadTop">
            <div id="eyesArea">
              <div class="aroundEyesClass">
                <div class="eyes" id="leftEye">
                  <span><div class="pupil"></div></span>
                </div>
              </div>

              <div class="aroundEyesClass">
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
            
          </div>
          <div class="arms rightArmPosition" id="rightArm">
            
          </div>
        </div>

        <div id="feetArea">
          <div class="feet" id="leftFoot"></div>
          <div class="feet" id="rightFoot"></div>
        </div>
      </div>
    </div>

    <div class="dnaDiv monkeyGenerationDiv" id="monkeyGenerationDiv${tokenId}">
      <b>
      Generation:           
      <span id="generationDisplayLine${tokenId}"></span>              
      </b>
    </div>            

    <div class="dnaDiv monkeyTokenIdDiv" id="monkeyTokenIdDiv${tokenId}">
      <b>
        Token ID: ${tokenId}           
        <span id="tokenIdDisplayLine${tokenId}"></span>              
      </b>
    </div>

    <div class="dnaDiv monkeyDNALine" id="monkeyDNALine${tokenId}">
      <b>
        DNA:
        
        <span id="dnaFirstGroup${tokenId}"></span>
        <span id="dnaSecondGroup${tokenId}"></span>
        <span id="dnaThirdGroup${tokenId}"></span>
        <span id="dnaFourthGroup${tokenId}"></span>

        
        <span id="dnaEyeShape${tokenId}"></span>
        <span id="dnaMouthShape${tokenId}"></span>
        <span id="dnaEyeBackgroundColor${tokenId}"></span>
        <span id="dnaLowerHeadColor${tokenId}"></span>
        <span id="dnaAnimation${tokenId}"></span>
        <span id="dnaspecial${tokenId}"></span>
      </b>
    </div>

    <div class="dnaDiv offerPriceDiv" id="offerPriceDiv${tokenId}">
      <b>
        Price in WEI:            
        <span id="offerPriceDisplayLine${tokenId}"></span>              
      </b>
    </div>

    <div class="dnaDiv offerOwnerDiv" id="offerOwnerDiv${tokenId}">
      <b>
        Owner:            
        <span id="offerOwnerDisplayLine${tokenId}"></span>              
      </b>
    </div>
  </div>   
  `     
} 





