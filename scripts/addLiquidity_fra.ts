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
    let value = ethers.utils.parseUnits('1', 18);
    const override = { gasPrice, value: value, gasLimit:500000};

    console.log(`====================Do your bussiness =======================`)
    // approve usdt token to router
    let usdtToken = await ethers.getContractAt('MockToken', TOKENS['USDT'][network.name]);
    let usdtDecimals = await usdtToken.decimals();
    let usdtUnit = ethers.utils.parseUnits('100', usdtDecimals);
    const tx1 = await usdtToken.approve(ROUTER_ADDRESS, usdtUnit);
    await wait(ethers, tx1.hash, '1# approve usdt token to router');
    // addLiquidity
    let veniceRouter = await ethers.getContractAt('VeniceRouter', ROUTER_ADDRESS);
    let token = TOKENS['USDT'][network.name];
    let amountTokenDesired = usdtUnit;
    let to = operator.address;
    let deadline = Math.floor(new Date().getTime() / 1000) + 1800; // 30 minutes
    const tx3 = await veniceRouter.addLiquidityETH(
        token,
        amountTokenDesired,
        0,
        0,
        to,
        deadline,
        override
    );
    await wait(ethers, tx3.hash, 'usdt-fra addLiquidity');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });