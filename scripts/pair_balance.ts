import { network, ethers } from 'hardhat';
import { Contract, ContractFactory, BigNumber, utils } from 'ethers';
import { encodeParameters, wait } from './utils';
const { ROUTER_ADDRESS, TOKENS, PAIRS } = require('./config');

async function main() {
    const { provider } = ethers;
    const [operator] = await ethers.getSigners();

    const estimateGasPrice = await provider.getGasPrice();
    const gasPrice = estimateGasPrice.mul(3).div(2);
    console.log(`Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
    const override = { gasPrice };

    console.log(`====================Do your bussiness =======================`)
    // approve usdt token to router
    let usdtToken = await ethers.getContractAt('MockToken', TOKENS['FRA'][network.name]);
    let usdtDecimals = await usdtToken.decimals();
    console.log('usdt decimals is: ', usdtDecimals);
    let pair_usdt_balance = await usdtToken.balanceOf(PAIRS['FRA-USDT'][network.name]);
    console.log('usdt-busd pair usdt balance is:', pair_usdt_balance.toString());
    //
    let busdToken = await ethers.getContractAt('MockToken', TOKENS['USDT'][network.name]);
    let busdDecimals = await busdToken.decimals();
    console.log('busd decimals is: ', busdDecimals);
    let pair_busd_balance = await busdToken.balanceOf(PAIRS['FRA-USDT'][network.name]);
    console.log('usdt-busd pair busd balance is:', pair_busd_balance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });