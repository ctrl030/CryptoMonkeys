const MonkeyContract = artifacts.require("MonkeyContract");

module.exports = function(deployer) {
  deployer.deploy(MonkeyContract);
};
