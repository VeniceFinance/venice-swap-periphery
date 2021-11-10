const veniceRouter = artifacts.require('VeniceRouter');

// ++++++++++++++++  Main Migration ++++++++++++++++ 
const migration = async (deployer, network, accounts) => {
  await Promise.all([
      deploy(deployer, network, accounts)
  ]);
}

// ++++++++++++++++  Deploy Functions ++++++++++++++++ 
module.exports = migration;

async function deploy(deployer, network, accounts) { 
  console.log("[Periphery] Start deploy on Network= " + network);

  let deployer_account = accounts[0];

  console.log("[Periphery] Begin to deploy VeniceRouter")
  await deployer.deploy(veniceRouter, '0x5E50395cD465Eb04f8ef780258d233A75Ce239dB', '0x27f9AcDBf683903646e1Ea36187f845493278Ab3');

  console.log("[Periphery] End");
}