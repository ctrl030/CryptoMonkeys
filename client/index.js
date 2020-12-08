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
