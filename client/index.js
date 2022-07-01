// Connecting with Web3.js functionalities
const web3 = new Web3(Web3.givenProvider);

// Representation of the ERC20 Token smart contract
let tokenInstance;

// Representation of the main smart contract
let instance;

// Representation of the marketplace contract
let marketInstance;

// User1 will be set to the correct account from Ganache (it's necessary to log in to this account via Metamask)
let user1;

// variable to check if user has approved market as operator yet
let user1MarketAllowed = false;

// variable to check if user has gotten their BananaToken from the faucet yet
let bananasGotten = false;

// variable to check if user has approved main contract to use his BananaToken yet
let mainContractBananasAllowed = false;

// Contract address for ERC20 contract "BananaToken", has to be updated when migrating => i.e. contract address is changing
const tokenAddress = "0x2E5cDA937Ed1EcA4679f419e06Ae50018559539B";

// Contract address for main contract "MonkeyContract", has to be updated when migrating => i.e. contract address is changing
const contractAddress = "0x9dd06bD740b5F67b4e100B487fF27E47d9Cd82ae";

// Contract address for marketplace contract "MonkeyMarketplace", has to be updated when migrating => i.e. contract address is changing
const marketContractAddress = "0x537c820172966C73E53454C8e2Ee365270dE8a6c";

// preparing accounts variable
let accounts;

// for API throttling, prevent events from triggering reactions more than once
let monkeyCreatedThrottler;
let breedThrottler;
let operatorThrottler; 
let marketTransactionThrottler;
let monkeySoldThrottler;

// When ready, during page load 
$(document).ready(async function () {

  // checking BananaToken status (faucet and allowance) and adapting buttons
  adaptBananaStatus();  

  // Enabling / connecting with Ethereum accounts
  accounts = await window.ethereum.enable();

  // Setting the representation of the token smart contract, specifying abi, contractAddress and first connected account in the users wallet
  tokenInstance = new web3.eth.Contract(tokenAbi, tokenAddress, {
    from: accounts[0],
  });

  // Setting the representation of the main smart contract, specifying abi, contractAddress and first connected account in the users wallet
  instance = new web3.eth.Contract(abi, contractAddress, {
    from: accounts[0],
  });
    
  // Setting user to first connected account in the users wallet
  user1 = accounts[0];
  
  // checking BananaToken status (faucet and allowance) and adapting buttons
  adaptBananaStatus();  

  // on pageload we subscribe to the MonkeyCreated event. From now on, whenever it is emitted, 
  // a notification is created and the css of the monkeyCreatedDiv will be emptied and then appended with the info
  // This only reacts to MonkeyCreated events triggered by "instance", which is specified to "from: accounts[0]"
  // I.e. only this user's created monkeys will trigger it.
  instance.events
    .MonkeyCreated()
    // when triggered, will receive incoming event as createdEvent
    .on("data", function (createdEvent) {
      // for API throttling
      console.log("monkeyCreatedThrottler is now at the start, set to: " + monkeyCreatedThrottler);
      if (monkeyCreatedThrottler != createdEvent.returnValues.tokenId){
        
        // left for later, multi-user version: 
        // check if both addresses are the same (also use checksum because of format),      
        // if not same, don't show to this user (NFT created by other user)  
        /*
          if (web3.utils.toChecksumAddress(owner) != web3.utils.toChecksumAddress(user1)) {
            console.log('createdEvent not for this address');
            return;
          }
        */

        // whenever the event triggers the listener, the incoming event will be console logged
        console.log('createdEvent: ');
        console.log(createdEvent);

        // extracting information from incoming event
        let owner = createdEvent.returnValues.owner;
        let tokenId = createdEvent.returnValues.tokenId;
        let parent1Id = createdEvent.returnValues.parent1Id;
        let parent2Id = createdEvent.returnValues.parent2Id;
        let genes = createdEvent.returnValues.genes;

        // making the relevant div visible, emptying and appending it with the success alert
        $("#monkeyCreatedDiv").css("display", "flex");
        $("#monkeyCreatedDiv").empty();
        $("#monkeyCreatedDiv").append(
          `        
            <ul id="monkeyCreatedDivUnorderedList">
              <li>Mango Monkey NFT created successfully!</li>
              <li>Here are the details: </li>
              <li>Owner:  ${owner}</li> 
              <li>Token ID: ${tokenId}</li>  
              <li>Parent Nr 1 ID: ${parent1Id}</li>
              <li>Parent Nr 2 ID: ${parent2Id}</li>
              <li>DNA: ${genes}</li>
            </ul>
          `      
        );

        // for API throttling        
        monkeyCreatedThrottler = tokenId;

        // taking out alert after some time       
        setTimeout(hideAndEmptyAlerts, 10000, "#monkeyCreatedDiv");        
      }   
    })

    // eventual errors will be console logged
    .on("error", function (error) {
      console.log(error);
    })
  ;   

  // incoming BreedingSuccessful events trigger alert
  // same logic as listening to MonkeyCreated event decription above (search " .MonkeyCreated()" )
  instance.events
    .BreedingSuccessful()
    .on("data", function (breedEvent) {
      // for API throttling
      console.log("breedThrottler is now at the start, set to: " + breedThrottler);
      if (breedThrottler != breedEvent.returnValues.tokenId){
        console.log('breedEvent: ');  
        console.log(breedEvent);      
        let tokenId = breedEvent.returnValues.tokenId;      
        let generation = breedEvent.returnValues.generation;
        let genes = breedEvent.returnValues.genes;
        let owner = breedEvent.returnValues.owner;
        let parent1Id = breedEvent.returnValues.parent1Id;
        let parent2Id = breedEvent.returnValues.parent2Id;
        showLastBornChildMonkey(tokenId);
        $("#monkeyMultipliedSuccessDiv").css("display", "flex");
        $("#monkeyMultipliedSuccessDiv").empty();
        $("#monkeyMultipliedSuccessDiv").append(
          `        
            <ul id="breedingSuccessfulDivUnorderedList">
              <li>Mango Monkey breeding successfully!</li>
              <li>Here are the details: </li>
              <li>Token ID:  ${tokenId}</li>  
              <li>Generation: ${generation}</li>
              <li>DNA: ${genes}</li>
              <li>Owner: ${owner}</li>            
              <li>Parent 1 ID: ${parent1Id}</li>
              <li>Parent 2 ID: ${parent2Id}</li>            
            </ul>
          `
        );
        // for API throttling
        breedThrottler = tokenId;
        // take out alert after some time
        setTimeout(hideAndEmptyAlerts, 10000, "#monkeyMultipliedSuccessDiv");      
      }  
    })
    .on("error", function (error) {
      console.log(error);
    })
  ;

  // incoming ApprovalForAll events trigger alert
  // same logic as listening to MonkeyCreated event decription above (search " .MonkeyCreated()" )
  instance.events
    .ApprovalForAll()
    .on("data", async function (operatorEvent) {
      // for API throttling
      console.log("operatorThrottler is now at the start, set to: " + operatorThrottler);      
      if (operatorThrottler != operatorEvent.returnValues._approved){  

        console.log('operatorEvent: ');
        console.log(operatorEvent);
        let messageSender = operatorEvent.returnValues.msgsender;
        let gaveOperator = operatorEvent.returnValues._approved;
        // let operatorAddress =operatorEvent.returnValues.operator;
        // console.log('operatorEvent messageSender: ' + messageSender);      
        // console.log('operatorEvent user1: ' + user1);
        // check if both addresses are the same (also use checksum because of format), if not same, don't show to this user (NFT created by other user)
        if (web3.utils.toChecksumAddress(messageSender) != web3.utils.toChecksumAddress(user1)) {
          return;
        }      
        $("#marketOperatorApprovedArea").css("display", "flex");
        // $("#marketOperatorApprovedArea").empty();
        $("#marketOperatorApprovedArea").append(
          `   
            <span id="marketOperatorApprovedText">
              Your address ${messageSender} has approved the market contract as operator and you can sell your Mango Monkey NFTs now.
            </span>
          `     
        )
        // for API throttling
        operatorThrottler = gaveOperator;
        // take out alert after some time
        setTimeout(hideAndEmptyAlerts, 10000, "#marketOperatorApprovedArea");
      }
    })
  .on("error", function (error) {
    console.log(error);
  });  

  await refreshBananasOwned();
})


// checks if user has already gotten BananaToken and allowed main contract to spend them
// depending on results, shows buttons
function adaptBananaStatus(){    
  if ( bananasGotten == false) {
    $("#allowMainSpendBananasButton").hide();  
    $("#getBananasButton").show();  
  }
  else if (bananasGotten == true) {
    $("#getBananasButton").hide(); 
    if (mainContractBananasAllowed == false)
    {
      $("#allowMainSpendBananasButton").show();
    } 
    else if (mainContractBananasAllowed == true){
      $("#getBananasButton").hide(); 
      $("#allowMainSpendBananasButton").hide();
    }    
  }
};

$("#getBananasButton").click( async () => {
  let bananasOwnedbefore = await tokenInstance.methods.balanceOf(user1).call();
  console.log("you've already got", bananasOwnedbefore , "bananas at the moment");
  console.log("will now get your bananas... ");
  await tokenInstance.methods.getBananas().send();
  bananasGotten = true;
  let bananasOwnedafter = await tokenInstance.methods.balanceOf(user1).call();
  console.log("you've now got", bananasOwnedafter , "bananas");
  adaptBananaStatus();
  await refreshBananasOwned();
});

$("#allowMainSpendBananasButton").click( async () => { 
  console.log("will now approve the main contract to handle your bananas... ");
  await tokenInstance.methods.approve(contractAddress, 1000).send();
  mainContractBananasAllowed = true;
  checkBananaSpendAllowed();    
  adaptBananaStatus();
});

async function checkBananaSpendAllowed() {
  let spendBananasAllowed = await tokenInstance.methods.allowance(user1, contractAddress).call();
  console.log("you have allowed the main contract to spend this many BananaToken: ", spendBananasAllowed);
}

async function refreshBananasOwned() {
  let bananasOwnedNow = await tokenInstance.methods.balanceOf(user1).call();
  console.log("bananasOwnedNow: ", bananasOwnedNow);
  $("#bananaDisplay").html(`Bananas: ${bananasOwnedNow}`);
}


// button switches to market
$("#switchToMarketButton").click( async () => { 
  // hides breeding functionalities
  hideBreedingElements();  
  // hides creation functionalities
  $("#monkeyRowCreation").hide();
  $("#buttonHolderArea").hide();  
  // emptying gallery
  $("#monkeyRowGallery").empty();     

  // resetting market
  hideMarketElements();
 
  // show market functionality
  $("#marketRow").css("display", "block"); 
  $("#marketButtonHolderArea").css("display", "flex");   
  $("#marketButtonHolderArea").show();

  // Setting the representation of the market smart contract, specifying abi, contractAddress and first account from Ganache's list at this moment
  marketInstance = new web3.eth.Contract(marketAbi, marketContractAddress, {
    from: accounts[0],
  });  
  console.log("marketInstance is");
  console.log(marketInstance);     

  // incoming MarketTransaction events trigger alert
  // very similar logic as listening to MonkeyCreated event decription above (search " .MonkeyCreated()" )
  // MarketTransaction has different types, attribute is TxType 
  marketInstance.events
    .MarketTransaction()
    .on("data", function (marketTransactionEvent) {
      // for API throttling
      console.log('marketTransactionThrottler is at the start and set to: ' + marketTransactionThrottler);
      if (marketTransactionThrottler != marketTransactionEvent.transactionHash){
        console.log('marketTransactionEvent: ');
        console.log(marketTransactionEvent);

        // identifying TxType, so different actions can be taken 
        let eventType = marketTransactionEvent.returnValues["TxType"].toString();
        console.log('eventType: ');
        console.log(eventType); 
        let tokenId = marketTransactionEvent.returnValues['tokenId'];

        // for all types, an additional market activity alert is displayed
        $("#marketActivityDiv").css("display", "flex");
        $("#marketActivityDiv").empty();
        $("#marketActivityDiv").append(
          `
            <span id="marketActivityApprovedText">        
              Market activity registered. Click "Market" again to refresh the offers. 
            </span>
          `
        );
        // take out alert after some time
        setTimeout(hideAndEmptyAlerts, 6000, "#marketActivityDiv")

        // Handling TxType 'Remove offer' 
        if (eventType == 'Remove offer') {
          console.log('TxType: "Remove offer" registered')
          $("#removeOfferAlertDiv").empty();
          $("#removeOfferAlertDiv").css("display", "flex");
          $("#removeOfferAlertDiv").append(
            `        
            TxType: "Remove offer" registered
            `
          );
          // take out alert after some time
          setTimeout(hideAndEmptyAlerts, 6000, "#removeOfferAlertDiv");
        }  

        // Handling TxType 'Create offer'
        if (eventType == 'Create offer') {
          console.log('TxType: "Create offer" registered');
          $("#newOfferCreatedAlertDiv").css("display", "flex");
          $("#newOfferCreatedAlertDiv").empty();
          $("#newOfferCreatedAlertDiv").append(
            `
              <span id="marketActivityApprovedText">        
                New offer created for your Mango Monkey NFT with Token ID ${tokenId}!  
              </span>
            `
          );
          // take out alert after some time
          setTimeout(hideAndEmptyAlerts, 6000, "#newOfferCreatedAlertDiv");
        }

        // Handling TxType 'Buy', used just as control mechanism,
        // more information is coming in via monkeySold event
        if (eventType == 'Buy') {
          console.log('TxType: "Buy" registered');        
        }
        // for API throttling, setting marketTransactionThrottler to transaction hash, so event only triggers once
        marketTransactionThrottler = marketTransactionEvent.transactionHash;
      }
    })
    .on("error", function (error) {
      console.log(error);
  }); 

  // same logic as listening to MonkeyCreated event decription above (search " .MonkeyCreated()" )
  marketInstance.events
  .MonkeySold ()
  .on("data", function (monkeySoldEvent) {
    // for API throttling
    console.log('monkeySoldThrottler is at the start and set to: ' + monkeySoldThrottler);     
    if (monkeySoldThrottler != monkeySoldEvent.transactionHash){    
      console.log('monkeySoldEvent: ');
      console.log(monkeySoldEvent);   
      let monkeySeller = monkeySoldEvent.returnValues.seller;
      let monkeybuyer = monkeySoldEvent.returnValues.buyer;
      let tokenId = monkeySoldEvent.returnValues.tokenId;
      let paidPriceInEth = monkeySoldEvent.returnValues.priceInGwei/ 1000000000;
      $("#monkeySoldAlertDiv").css("display", "flex");
      $("#monkeySoldAlertDiv").empty();
      $("#monkeySoldAlertDiv").append(
        `
          <ul id="monkeySoldList">
            <li>Mango Monkey NFT ${tokenId} was sold for ${paidPriceInEth} Ether.</li>
            <li>New owner: ${monkeybuyer}</li>
            <li>Seller: ${monkeySeller}</li>               
          </ul>        
        `
      );
      // take out alert after some time
      setTimeout(hideAndEmptyAlerts, 6000, "#monkeySoldAlertDiv")
      // for API throttling
      monkeySoldThrottler = monkeySoldEvent.transactionHash;
    }  
  })
  .on("error", function (error) {
    console.log(error);
  })   
  
});

// function to take out alerts after some time
async function hideAndEmptyAlerts(alertBoxToHide) {
  await fadeOutAlerts(alertBoxToHide); 
  setTimeout(emptyAlerts, 3000, alertBoxToHide); 
}

// passing on parameter and fadeying out that div
async function fadeOutAlerts(alertBoxToFadeOut) {  
  $(alertBoxToFadeOut).fadeOut();  
}

// passing on parameter and emptying that div
async function emptyAlerts(alertBoxToHide) {  
  $(alertBoxToHide).empty();  
}

// Button for user to remove one of his sell offers, calls smart contract
$("#removeOfferButton").click( async () => {  
tokenIdToRemoveOffer = $("#removeOffTokenIdInputField").val(); 
console.log("user selected to remove the offor for tokenId: " + tokenIdToRemoveOffer );
await marketInstance.methods.removeOffer(tokenIdToRemoveOffer).send();
$("#removeOffTokenIdInputField").val("");
showUsersOffersButtonFunct();
});

// Button for user to see his own NFTs on sale
$("#showUsersOffersButton").click( async () => { 
  showUsersOffersButtonFunct();  
});

// selling functionality - shows user's active offers
async function showUsersOffersButtonFunct () {

  // clean up navbar
  $("#offerButtonHolderArea").hide(); 
  $("#buyButtonHolderArea").hide();

  // empty display area
  $("#monkeyDisplayArea").empty();   
  
  // offersArrayRaw still includes old/deleted offers, set to 0
  var offersArrayRaw = await marketInstance.methods.getAllTokenOnSale().call();
  // console.log("offersArrayRaw, unfiltered yet: ");
  // console.log(offersArrayRaw);

  // Array of tokenIds for which an active order exists 
  var offerTokenIdsArray = [];

  // Array of the complete offers
  var completeOffersArray = [];

  // refining offersArrayRaw into offerTokenIdsArray and completeOffersArray to only show correct offers
  for (let index = 0; index < offersArrayRaw.length; index++) {
    const tokenId = offersArrayRaw[index];

    // filtering out inactive offers (old/deleted offers, set to 0)
    if (tokenId != 0) {

      // adding active offers to offerTokenIdsArray
      offerTokenIdsArray.push(tokenId);

      // querying the complete offer for this tokenId from the blockchain
      var completeOffer = await marketInstance.methods.getOffer(tokenId).call();      

      var offerOwner = completeOffer.seller;     

      // comparing if the offer's owner is the logged in user
      if ( web3.utils.toChecksumAddress(offerOwner) == web3.utils.toChecksumAddress(user1) ) {

        // adding all active, complete offers to completeOffersArray
        completeOffersArray.push(completeOffer);

        // converting offer price from WEI into ether
        var offerPrice = web3.utils.fromWei(completeOffer.price);

        // only show first 18 digits of owner address
        if (offerOwner.length > 18) {
          offerOwner = offerOwner.substring(0, 17) + "...";
        }

        // querying NFT data/DNA string from main contract
        var monkeyInOffer = await instance.methods.getMonkeyDetails(tokenId).call();

        // creating DNA object from genes string of numbers
        const dnaObject = await decipherDNAtoObject(monkeyInOffer);           

        // Call to create and append HTML for each offer, marks built monkeyboxes with class boxtype, i.e. "offerBox"
        const boxtype = "offerBox";        
        $("#monkeyDisplayArea").append(buildMonkeyBoxes(tokenId, boxtype)); 
            
        // console.log("tokenIdDNA: ");
        // console.log(dnaObject);   

        // generation variable
        const tokenGeneration = monkeyInOffer.generation;

        // adding generation, offer's price and current owner to HTML of display boxes
        $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);
        $(`#offerPriceDisplayLine${tokenId}`).html(offerPrice);
        $(`#offerOwnerDisplayLine${tokenId}`).html(offerOwner); 
        
        // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
        // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
        renderMonkey(dnaObject, tokenId);
        
        // retrieving and showing price of offer
        showPrices(tokenId);
      }
    }    
  }

  // checking if the monkeyDisplayArea is already displaying any monkeys at this point
  // if not, alert is displayed
  if($("#monkeyDisplayArea").children().length > 0){
    // show buttons to remove offer
    $("#removeOffButtonHolderArea").css("display", "flex");
    $("#removeOffButtonHolderArea").show(); 
  } else {
    console.log("user has no monkeys on sale")
    $("#noOwnedNFTsOnSaleDiv").css("display", "flex");
    $("#noOwnedNFTsOnSaleDiv").empty();
    $("#noOwnedNFTsOnSaleDiv").append(
      `
        <span>
          You have no Mango Monkeys on sale at the moment. Click on "Market" and "Sell Monkeys" to change that.                        
        </span>        
      `
    );
    // take out alert after some time
    setTimeout(hideAndEmptyAlerts, 6000, "#noOwnedNFTsOnSaleDiv")
  }
  $("#removeOffTokenIdInputField").val("");
}

// button to show the sell area
$("#showSellAreaButton").click( async () => { 
  showSellAreaButtonFunct();
  $(`#monkeyDisplayArea`).empty();
  galleryLogic(`#monkeyDisplayArea`);
});

async function showSellAreaButtonFunct () {
  $("#removeOffButtonHolderArea").hide();
  $("#buyButtonHolderArea").hide();

  $("#offerTokenIdInputField").val("");
  $("#offerPriceInputField").val("");

  if ( user1MarketAllowed == false) {
    $("#offerInputfieldHolderDiv").hide();
    $("#createOfferButton").hide(); 

    $("#makeMarketOperatorButton").show();  
    }
  else if (user1MarketAllowed == true) {
    $("#offerInputfieldHolderDiv").show();
    $("#createOfferButton").show();  

    $("#makeMarketOperatorButton").hide();  
    
  }

  $("#offerButtonHolderArea").css("display", "flex");
  $("#offerButtonHolderArea").show(); 
  $("#removeOffTokenIdInputField").val("");

  
}

// function for adapting visual of offer boxes, adding in prices
function showPrices(tokenId) {
  $(`#monkeyBox${tokenId}.monkey`).css("top", "29%");  
  $(`#monkeyTokenIdDiv${tokenId}`).css("bottom", "130px");
  $(`#monkeyGenerationDiv${tokenId}`).css("bottom", "100px");
  $(`#monkeyDNALine${tokenId}`).css("bottom", "70px");  
  $(`#offerPriceDiv${tokenId}`).css("display", "flex"); 
  $(`#offerOwnerDiv${tokenId}`).css("display", "flex"); 
}

// function for adapting visual of offer boxes, taking out prices
function withoutPrices() {
  $(`.monkey`).css("top", "32%");  
  $(`.monkeyTokenIdDiv`).css("bottom", "70px");
  $(`#monkeyGenerationDiv`).css("bottom", "40px");
  $(`#monkeyDNALine`).css("bottom", "10px"); 
  $(`#offerPriceDiv`).css("display", "none");
  $(`#offerOwnerDiv`).css("display", "none");
}

// button to show the buy area, shows all offers minus the user's own ones
$("#showBuyAreaButton").click( async () => { 

  //resetting market
  hideMarketElements(); 
  $("#marketRow").css("display", "block"); 
  $("#marketButtonHolderArea").css("display", "flex");   
  $("#marketButtonHolderArea").show();

  // empty display area
  $("#monkeyDisplayArea").empty(); 

  // Reset buy input fields
  $("#buyMonkeyTokenIdInputField").val("");
  $("#confirmPriceInputField").val("");
  
  // buying functionality - all active offers, without user's
  // offersArrayRaw still includes old/deleted offers, set to 0
  var offersArrayRaw = await marketInstance.methods.getAllTokenOnSale().call();
  console.log("offersArrayRaw, unfiltered yet: ");
  console.log(offersArrayRaw);

  // Array of tokenIds for which an active order exists 
  var offerTokenIdsArray = [];

  // Array of the complete offers
  var completeOffersArray = [];

  // filtering offers and showing the remaining ones
  for (let index = 0; index < offersArrayRaw.length; index++) {
    const tokenId = offersArrayRaw[index];

    // filtering out inactive offers (old/deleted offers, set to 0)
    if (tokenId != 0) {

      // adding active offers to offerTokenIdsArray
      offerTokenIdsArray.push(tokenId);

      // querying the complete offer for this tokenId from the blockchain
      var completeOffer = await marketInstance.methods.getOffer(tokenId).call(); 

      var offerOwner = completeOffer.seller;

      // only using the offers that aren't from the logged in user
      if ( web3.utils.toChecksumAddress(offerOwner) != web3.utils.toChecksumAddress(user1) ) {

        // converting offer price from WEI into ether
        var offerPrice = web3.utils.fromWei(completeOffer.price);

        // adding all active, complete offers to completeOffersArray
        completeOffersArray.push(completeOffer);

        // showing only first 18 characters of owner address
        if (offerOwner.length > 18) {
          offerOwner = offerOwner.substring(0, 17) + "...";
        }

        // querying smart contract for NFT details
        var monkeyInOffer = await instance.methods.getMonkeyDetails(tokenId).call();

        // creating DNA object from genes string of numbers
        const dnaObject = await decipherDNAtoObject(monkeyInOffer);

        // Call to create and append HTML for each offer, marks built monkeyboxes with class boxtype, i.e. "offerBox"
        const boxtype = "offerBox";
        $("#monkeyDisplayArea").append(buildMonkeyBoxes(tokenId, boxtype));
            
        // console.log("tokenIdDNA: ");
        // console.log(dnaObject);   

        // generation variable
        const tokenGeneration = monkeyInOffer.generation;

        // adding generation, offer's price and current owner to HTML of display boxes
        $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);
        $(`#offerPriceDisplayLine${tokenId}`).html(offerPrice);
        $(`#offerOwnerDisplayLine${tokenId}`).html(offerOwner); 
        
        // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
        // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
        renderMonkey(dnaObject, tokenId);        

        // adapting CSS to show prices
        showPrices(tokenId);
      }      
    }    
  }

  console.log("Active offers exist for these tokenIds: ");
  console.log(offerTokenIdsArray);

  // checking if NFT offers are displayed, if not, don't show buttons
  if($("#monkeyDisplayArea").children().length > 0){
    // show buttons to buy
    $("#buyButtonHolderArea").css("display", "flex");
    $("#buyButtonHolderArea").show();         
  } else {
    console.log("no open offers to buy from")
    $("#noOpenoffersAlertDiv").css("display", "flex");
    $("#noOpenoffersAlertDiv").empty();
    $("#noOpenoffersAlertDiv").append(
      `
        <span>
          There are no open offers from other people at the moment. Share the game and come back later!                        
        </span>        
      `
    );
    // take out alert after some time
    setTimeout(hideAndEmptyAlerts, 6000, "#noOpenoffersAlertDiv")
  }

}); 

// button to buy a Mango Monkey NFT
// takes in user's inputs and compares them to offer details on-chain
$("#buyMonkeyButton").click( async () => {  

  // this is the tokenId the user enters to buy
  let tokenIdToBuy = $("#buyMonkeyTokenIdInputField").val();
  console.log("tokenIdToBuy:"); 
  console.log(tokenIdToBuy);

  // this is the offer price the user confirmed by entering it
  let buyersConfirmedPriceToPay = $("#confirmPriceInputField").val();  
  console.log("buyersConfirmedPriceToPay:"); 
  console.log(buyersConfirmedPriceToPay);

  // converting ETH to WEI
  let confirmedInWEI = web3.utils.toWei(buyersConfirmedPriceToPay);

  // querying offer details from market contract
  let offerDetails = await marketInstance.methods.getOffer(tokenIdToBuy).call();
  console.log("offerDetails:");
  console.log(offerDetails);      
  
  // querying the offerDetails and converting that price from WEI into ether
  let correctPrice = web3.utils.fromWei(offerDetails.price);
  console.log("correctPrice:");
  console.log(correctPrice);
  
  // if the price the user confirmed and the offer details on-chain match up, 
  // the buyMonkey function is called and the matching amount transfered
  if (buyersConfirmedPriceToPay == correctPrice) {
    await marketInstance.methods.buyMonkey(tokenIdToBuy).send({value: `${confirmedInWEI}` });
  }

}); 

// Listens to button click, then creates dnsStr (16 digits number string, same format as genes) 
// from concatting all the already set css values
// then calls the contract's createDemoMonkey function and mints a demo Mango Monkey that contains this string 
$("#mintMonkey").click(async () => {
  let dnaStr = getDna();

  await instance.methods.createDemoMonkey(dnaStr, user1).send({}, function (error, txHash) {
    if (error) {
      console.log(error);
    } else {
      console.log('createDemoMonkey txHash: ');
      console.log(txHash);
    }   
  }); 

  await refreshBananasOwned();
  
});

// CSS cleanup to hide breeding functionality
function hideBreedingElements() {
  $("#parentsArea").empty();
  $("#parentsArea").css("display", "none");
  $("#childArea").empty();
  $("#childArea").css("display", "none");
  $("#multiplyButtonHolderArea").hide();
  $("#monkeyMultipliedSuccessDiv").hide();
  $("#monkeyRowMultiply").hide();  
}

// CSS cleanup to hide market functionality
function hideMarketElements() {  
  $("#marketRow").css("display", "none"); 
  $("#marketButtonHolderArea").css("display", "none"); 
  $("#offerButtonHolderArea").css("display", "none");
  $("#removeOffButtonHolderArea").css("display", "none");
  $("#monkeyDisplayArea").empty();   
  $("#chooseMonkeyForOfferInputField").val("");
  $("#choosePriceForOfferInputField").val("");  
}

// User must first give market contract address operator status, to put a monkey up for sale 
$("#makeMarketOperatorButton").click(async () => {
  
  // user calls main smart contract and gives operator status to market to handle NFTs
  let setOperatorRequest = await instance.methods.setApprovalForAll(marketContractAddress, true).send();
  // console.log("setOperatorRequest: ");
  // console.log(setOperatorRequest);

  // verifying, i.e. querying main smart contract, to find out if operator status was given to market
  let isMarketOperator = await instance.methods.isApprovedForAll(user1, marketContractAddress).call();
  // console.log('isMarketOperator: ');
  // console.log(isMarketOperator);

  // if isMarketOperator is true, this will set user1MarketAllowed to also true,
  // user1MarketAllowed is the global variable saving whether operator status was already given
  user1MarketAllowed = isMarketOperator;
  showSellAreaButtonFunct();
});

let tokenIdToCreateOffer;
let priceToCreateOfferInWEI; 

// Create offer button
$("#createOfferButton").click(async () => {  

  // taking in the NFT tokenId that the user wants to set up for offer
  tokenIdToCreateOffer = $("#offerTokenIdInputField").val(); 
  console.log(tokenIdToCreateOffer);

  // taking in the price in ether, that the user wants to put in the offer
  // then transforming price into WEI
  priceToCreateOfferInWEI = web3.utils.toWei($("#offerPriceInputField").val());   
  console.log(priceToCreateOfferInWEI);

  // calling market smart contract to create offer
  await marketInstance.methods.setOffer(priceToCreateOfferInWEI, tokenIdToCreateOffer).send();
});

// Button to monkey creation (starting page)
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

// Button back to breeding area start
$("#backToMultiplyButton").click(() => {
  switchToMultiply()
});

// function for breeding area
function switchToMultiply() {

  // resetting breeding functionalities
  hideBreedingElements();  

  // showing breeding functionalities
  $("#multiplyButtonHolderArea").css("display", "flex");  
  $("#multiplyButtonHolderArea").show(); 
  $("#makeMoreMonkeysButton").hide();   
  $("#showParentsButton").show();  

  // resetting input fields and showing them
  $("#parent1InputField").val("");
  $("#parent2InputField").val("");
  $("#parent1InputField").show(); 
  $("#parent2InputField").show(); 

  // adapting UI
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

// global variables to store NFT parent IDs
var parent1Input;
var parent2Input;

// button to multiply NFT monkeys
$("#makeMoreMonkeysButton").click(async () => { 

  //calling breed function in main smart contract
  await instance.methods.breed(parent1Input, parent2Input).send();
 
  // let newDetails = await instance.methods.getMonkeyDetails(newMonkeyTokenId).call();
  // console.log(newDetails);

});

// function to show the NFT that the user just created via breed function
async function showLastBornChildMonkey(tokenId) {

  // resetting childArea
  $("#childArea").empty(); 
  $("#childArea").show();  

  //querying NFT details for the incoming token ID from the main smart contract
  let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call();

  // creating DNA object from genes string of numbers
  const dnaObject = await decipherDNAtoObject(myCryptoMonkey);   

  // Call to create and append HTML for each offer, marks built monkeyboxes with class boxtype, i.e. "childBox"
  const boxtype = "childBox";
  await $("#childArea").append(buildMonkeyBoxes(tokenId, boxtype));    
                       
  // console.log("tokenIdDNA: ");
  // console.log(dnaObject);   

  // adding generation to HTML of display boxes
  const tokenGeneration = myCryptoMonkey.generation; 
  $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

  // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
  // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
  renderMonkey(dnaObject, tokenId);  
}

// button to show the both NFTs that were selected as parents
$("#showParentsButton").click(async () => {
  
  // taking in user inputs from input fields
  parent1Input = $("#parent1InputField").val();
  parent2Input = $("#parent2InputField").val();

  // userBalance will be the number of monkeys the user has
  var userBalance = await instance.methods.balanceOf(user1).call();
  console.log(`user1 has ${userBalance} Mango Monkeys`);

  // An array that holds all of the user's tokenIds
  let myMonkeyIdsArray = await instance.methods.findMonkeyIdsOfAddress(user1).call();       
  // console.log("myMonkeyIdsArray: ");
  // console.log(myMonkeyIdsArray);

  // booleans to check whether the user owns the NFTs (token IDs) they entered 
  var parent1IsOwnedBool = false;
  var parent2IsOwnedBool = false;

  // checking user's myMonkeyIdsArray and comparing esch NFT in there to both user inputs
  for (let index = 0; index < myMonkeyIdsArray.length; index++) {
    const monkeyToCheckAgainst = myMonkeyIdsArray[index];  

    if (monkeyToCheckAgainst == parent1Input) {
      parent1IsOwnedBool = true;
    }

    if (monkeyToCheckAgainst == parent2Input) {
      parent2IsOwnedBool = true;
    }       
  }

  // if at least one of the NFT IDs is 0, throw alert
  if (parent1Input == 0 || parent2Input == 0) { 
   alert("Put in both parents' Token IDs")   
  } 
  // if at least one of the NFT IDs isn't owned, throw alert
  else if (parent1IsOwnedBool == false || parent2IsOwnedBool == false) {
    alert("You must own both parent monkeys, check gallery")
  }
  // if both NFT IDs are the same, throw alert 
  else if (parent1Input == parent2Input) { 
    alert("Must be 2 different monkeys you own")   
  }
  // if none of these, display them as valid parents
  else {      

    // adapting CSS
    $("#monkeyRowMultiply").css("display", "flex");    
    $("#childArea").hide(); 
    $("#backToMultiplyButton").show();    
    $("#makeMoreMonkeysButton").show();
    $("#showParentsButton").hide();

    // adapting CSS
    $("#parentsArea").empty();
    $("#parentsArea").css("display", "flex");   
    $("#parent1InputField").hide();  
    $("#parent2InputField").hide(); 

    console.log(parent1Input);
    console.log(parent2Input);   

    // getting the details for both parent NFTs
    var myIncomingmonkeyIdsArray = [parent1Input, parent2Input];
    for (let j = 0; j < 2; j++) {
      const tokenId = myIncomingmonkeyIdsArray[j];

      // for each NFT, querying main smart contract
      let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call();

      // creating DNA object from genes string of numbers
      const dnaObject = await decipherDNAtoObject(myCryptoMonkey);       
      
      // Call to create and append HTML for each cryptomonkey of the connected user
      $("#parentsArea").append(buildMonkeyBoxes(tokenId));  

      // adding generation to HTML of display boxes
      const tokenGeneration = myCryptoMonkey.generation;
      $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

      // console.log("tokenIdDNA: ");
      // console.log(dnaObject);   
  
      // Call to apply CSS on the HTML structure, effect is styling and showing the next monkey
      // needs a set of DNA, if no tokenId is given, reverts to "Creation" in the receiving functions
      renderMonkey(dnaObject, tokenId);         
    };
  }; 
});

// The 16 digit DNA genes number is received from the incoming myCryptoMonkey.genes,
// then turned into a string, then from the digit's position,
// the correct CSS variables are created and a tokenIdDNA object is returned 
async function decipherDNAtoObject(myCryptoMonkey) {  

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

  // returning the created tokenIdDNA object
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

  // calling gallery logic, showing the correct type of NFT display
  galleryLogic(`#monkeyRowGallery`);

});

// function to display several NFT monkeys
// incoming variable determines where they will be shown, i.e. in the gallery vs market, etc.
async function galleryLogic(divToAppendTo) {
  // userBalance will be the number of monkeys the user has
  var userBalance = await instance.methods.balanceOf(user1).call();
  console.log(`user1 has ${userBalance} Mango Monkeys`);

  // An array that holds all of user1's tokenIds
  let myMonkeyIdsArray = await instance.methods.findMonkeyIdsOfAddress(user1).call();       
  // console.log("myMonkeyIdsArray: ");
  // console.log(myMonkeyIdsArray);
  
  // Looping through the user's tokenIds and for each:
  // reading the "DNA string",
  // creating the correct CSS data from it
  // creating an unique HTML structure in the gallery 
  // applying the CSS to it
  for (let j = 0; j < userBalance; j++) {
    const tokenId = myMonkeyIdsArray[j];
    let myCryptoMonkey = await instance.methods.getMonkeyDetails(tokenId).call();
    // creating DNA object from genes string of numbers
    const dnaObject = await decipherDNAtoObject(myCryptoMonkey); 

    // Call to create and append HTML for each cryptomonkey of the connected user
    $(`${divToAppendTo}`).append(buildMonkeyBoxes(tokenId));

    // adding generation to HTML of display boxes
    const tokenGeneration = myCryptoMonkey.generation;
    $(`#generationDisplayLine${tokenId}`).html(tokenGeneration);

    // console.log("tokenIdDNA: ");
    // console.log(dnaObject);   

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
        Price in ETH:            
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
};
