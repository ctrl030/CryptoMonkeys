const BananaToken = artifacts.require("BananaToken");
const MonkeyContract = artifacts.require("MonkeyContract");
const MonkeyMarketplace = artifacts.require("MonkeyMarketplace");

module.exports = async function(deployer, network, accounts) {
 
  try {  

   await deployer.deploy(BananaToken);

   const BananaTokenInstance = await BananaToken.deployed();   

   await deployer.deploy(MonkeyContract, BananaToken.address);

   const MonkeyContractinstance = await MonkeyContract.deployed();

   await deployer.deploy(MonkeyMarketplace, MonkeyContract.address);

   const MonkeyMarketplaceInstance = await MonkeyMarketplace.deployed();
  }

  catch (err) {
    console.log("Error: " + err)
  }  

};
