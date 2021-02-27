const MonkeyContract = artifacts.require("MonkeyContract");
// const MonkeyMarketplace = artifacts.require("MonkeyMarketplace");


module.exports = async function(deployer, network, accounts) {
 
  try {
  
   await deployer.deploy(MonkeyContract);

   const MonkeyContractinstance = await MonkeyContract.deployed();

   // await deployer.deploy(MonkeyMarketplace, instance.address);

   // const MonkeyMarketplaceInstance = await MonkeyMarketplace.deployed();   

  }

  catch (err) {
    console.log("Error: " + err)
  }  

};
