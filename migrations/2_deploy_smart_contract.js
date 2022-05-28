const Wordgame = artifacts.require("Wordgame");

module.exports = function(deployer) {
  deployer.deploy(Wordgame);
};