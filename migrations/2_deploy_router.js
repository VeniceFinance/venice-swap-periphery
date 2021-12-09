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
  await deployer.deploy(veniceRouter, '0x4409DbE5E00725EF302C9cD1bC5C5B16596aA90A');

  console.log("[Periphery] End");
}