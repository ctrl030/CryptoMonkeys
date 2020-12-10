const MonkeyContract = artifacts.require("MonkeyContract");


module.exports = async function(deployer) {
 
  try {
  
   await deployer.deploy(MonkeyContract);

   const instance = await MonkeyContract.deployed();

   console.log(instance);

  }

  catch (err) {
    console.log("Error: " + err)
  }  

};
