import { network, ethers } from 'hardhat';
import { Contract, ContractFactory, BigNumber, utils } from 'ethers';
import { encodeParameters, wait } from './utils';
const { ROUTER_ADDRESS, TOKENS } = require('./config');

async function main() {
    const { provider } = ethers;
    const [operator] = await ethers.getSigners();

    const estimateGasPrice = await provider.getGasPrice();
    const gasPrice = estimateGasPrice.mul(3).div(2);
    console.log(`Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
    const override = { gasPrice, gasLimit: 3000000 };

    console.log(`====================Do your bussiness =======================`)
    // approve usdt token to router
    let usdtToken = await ethers.getContractAt('MockToken', TOKENS['FRA'][network.name]);
    let usdtDecimals = await usdtToken.decimals();
    let usdtUnit = ethers.utils.parseUnits('1', usdtDecimals);
    const tx1 = await usdtToken.approve(ROUTER_ADDRESS, usdtUnit);
    await wait(ethers, tx1.hash, '1# approve usdt token to router');
    // swap usdt to busd
    let veniceRouter = await ethers.getContractAt('VeniceRouter', ROUTER_ADDRESS);
    let amountIn = usdtUnit;
    let amountOutMin = 0;
    let path = [TOKENS['FRA'][network.name], TOKENS['USDT'][network.name]];
    let to = operator.address;
    let deadline = Math.floor(new Date().getTime() / 1000) + 1800; // 30 minutes
    const tx3 = await veniceRouter.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline,
        override
    );
    await wait(ethers, tx3.hash, 'swap usdt to busd');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });