var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x0D344fADC22DcAcf4Dadc36AEFC9C5e38a14EE29";

$(document).ready(function () {
  window.ethereum.enable().then(function (accounts) {
    instance = new web3.eth.Contract(abi, contractAddress, {
      from: accounts[0],
    });
    user = accounts[0];

    console.log(instance);

    $("#mintMonkey").click(() => {
      let dnaStr = getDna();

      instance.methods
        .createGen0Monkey(dnaStr)
        .send({}, function (error, txHash) {
          if (error) {
            console.log(error);
          } else {
            console.log(txHash);
          }
        });

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
            "Crypto Monkey created successfully! Here are the details: " 
            + " owner: " + owner 
            + " tokenId: " + tokenId 
            + " parent1Id: " + parent1Id 
            + " parent2Id: " + parent2Id 
            + " genes: " + genes
              
          );
        })
        .on("error", function(error){console.log(error)});
    });
  });
});
