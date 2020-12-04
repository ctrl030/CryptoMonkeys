var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x26757a7Da1601a47453b18992c1040D92c260e25";

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
      $("#monkeyCreatedDiv").append(
        `
          <ul>
            <li>`Crypto Monkey created successfully! `</li>
            <li>`Here are the details: `</li>
            <li>`owner: ` + owner </li> 
            <li>`tokenId: ` + tokenId </li>  
            <li>`parent1Id: ` + parent1Id </li>
            <li>`parent2Id: ` + parent2Id </li>
            <li>`genes: ` + genes </li>
          </ul>
        `
      );
    })
    .on("error", function (error) {
      console.log(error);
    });
});
