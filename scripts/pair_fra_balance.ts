import { network, ethers } from 'hardhat';
import { Contract, ContractFactory, BigNumber, utils } from 'ethers';
import { encodeParameters, wait } from './utils';
const { TOKENS, PAIRS } = require('./config');

async function main() {
    const { provider } = ethers;
    const [operator] = await ethers.getSigners();

    const estimateGasPrice = await provider.getGasPrice();
    const gasPrice = estimateGasPrice.mul(3).div(2);
    console.log(`Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
    const override = { gasPrice };

    console.log(`====================Do your bussiness =======================`)
    // pair usdt balance
    let usdtToken = await ethers.getContractAt('MockToken', TOKENS['USDT'][network.name]);
    let usdtDecimals = await usdtToken.decimals();
    console.log('usdt decimals is: ', usdtDecimals);
    let pair_usdt_balance = await usdtToken.balanceOf(PAIRS['USDT-FRA'][network.name]);
    console.log('usdt-busd pair usdt balance is:', pair_usdt_balance.toString());
    // pair fra balance
    let wfraToken = await ethers.getContractAt('WFRA', TOKENS['WFRA'][network.name]);
    let wfraDecimals = await wfraToken.decimals();
    console.log('fra decimals is: ', wfraDecimals);
    let pair_fra_balance = await wfraToken.balanceOf(PAIRS['USDT-FRA'][network.name]);
    console.log('usdt-busd pair fra balance is:', pair_fra_balance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });