import { network, ethers } from 'hardhat';
import { Contract, ContractFactory, BigNumber, utils } from 'ethers';
import { encodeParameters, wait } from './utils';
const { ROUTER_ADDRESS, TOKENS, PAIRS} = require('./config');

async function main() {
    const { provider } = ethers;
    const [operator] = await ethers.getSigners();

    const estimateGasPrice = await provider.getGasPrice();
    const gasPrice = estimateGasPrice.mul(3).div(2);
    console.log(`Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
    const override = { gasPrice };

    console.log(`====================Do your bussiness =======================`)
    // approve usdt token to router
    let pairToken = await ethers.getContractAt('ERC20', PAIRS['FRA-USDT'][network.name]);
    let pair_balance = await pairToken.balanceOf(operator.address);
    const tx1 = await pairToken.approve(ROUTER_ADDRESS, pair_balance);
    await wait(ethers, tx1.hash, '1# approve pair token to router');
    // removeLiquidity
    let veniceRouter = await ethers.getContractAt('VeniceRouter', ROUTER_ADDRESS);
    let tokenA = TOKENS['FRA'].findora;
    let tokenB = TOKENS['USDT'].findora;
    let liquidity = pair_balance;
    let to = operator.address;
    let deadline = Math.floor(new Date().getTime() / 1000) + 1800; // 30 minutes
    const tx3 = await veniceRouter.removeLiquidity(
        tokenA,
        tokenB,
        liquidity,
        0,
        0,
        to,
        deadline
    );
    await wait(ethers, tx3.hash, 'usdt-busd removeLiquidity');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });