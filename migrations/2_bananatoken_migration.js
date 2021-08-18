const Token = artifacts.require("BananaToken");

module.exports = async function(deployer, network, accounts) {
 
  try {  

   await deployer.deploy(Token);

   const BananaTokenInstance = await Token.deployed();   

  }

  catch (err) {
    console.log("Error: " + err)
  }  

};
