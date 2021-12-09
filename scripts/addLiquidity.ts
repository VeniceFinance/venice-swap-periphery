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
    let usdtUnit = ethers.utils.parseUnits('10', usdtDecimals);
    let tx1 = await usdtToken.approve(ROUTER_ADDRESS, usdtUnit);
    await wait(ethers, tx1.hash, '1# approve usdt token to router');

    // approve busd token to router
    let busdToken = await ethers.getContractAt('MockToken', TOKENS['USDT'][network.name]);
    let busdDecimals = await busdToken.decimals();
    let busdUnit = ethers.utils.parseUnits('20', busdDecimals);
    let tx2 = await busdToken.approve(ROUTER_ADDRESS, busdUnit);
    await wait(ethers, tx2.hash, '2# approve busd token to router');
    // addLiquidity
    let veniceRouter = await ethers.getContractAt('VeniceRouter', ROUTER_ADDRESS);
    let tokenA = TOKENS['FRA'][network.name];
    let tokenB = TOKENS['USDT'][network.name];
    let amountADesired = usdtUnit;
    let amountBDesired = busdUnit;
    let to = operator.address;
    let deadline = Math.floor(new Date().getTime() / 1000) + 1800; // 30 minutes
    const tx3 = await veniceRouter.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        0,
        0,
        to,
        deadline,
        override
    );
    await wait(ethers, tx3.hash, 'usdt-busd addLiquidity');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });