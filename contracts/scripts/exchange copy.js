const hre = require('hardhat');
const ethers = require('ethers');
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const usdtArtifact  = require('../../artifacts/contracts/DREX.sol/DREX.json');
const wethArtifact  = require('../../artifacts/contracts/ERC20.sol/REAL.json');

const CONTRACT_ADDRESS = {
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    WETH: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
    ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564' // Uniswap Router
}

// const CONTRACT_ADDRESS = {
//     USDT: '0x19412772DF291a678A2511d3d697b9B0Df3Df97d',
//     WETH: '0xb4ee6879Ba231824651991C8F0a34Af4d6BFca6a',
//     ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564' // Uniswap Router
// }

async function getSigner() {

    console.log('---- getSigner ----');

    const [signer] = await hre.ethers.getSigners();

    console.log(`Signer: ${signer}`);

    if (!signer) {
        throw new Error("Could not get signer");
    }
    return signer;
}

// async function getSigner() {    
//     const accounts = await ethers.getSigners();
//     if (!accounts || accounts.length === 0) {
//         throw new Error("Could not get signer");
//     }
//     return accounts[0];
// }

function getContractInstance(address, artifact, signer) {
    return new ethers.Contract(address, artifact, signer);
}

async function logBalances(provider, signer, contracts) {
    const {usdt, weth} = contracts;
    const ehtBalance = await provider.getBalance(signer.address);
    const usdtBalance = await usdt.balanceOf(signer.address);
    const wdrexBalance = await weth.balanceOf(signer.address);

    console.log('--------------------');
    console.log(`ETH Balance: ${ethers.utils.formatEther(ehtBalance)}`);
    console.log(`USDT Balance: ${ethers.utils.formatEther(usdtBalance)}`);
    console.log(`WDREX Balance: ${ethers.utils.formatEther(wdrexBalance)}`);
    console.log('--------------------');
}

async function executeSwap(provider, signer, contracts, amountIn) {
    const {usdt, weth} = contracts;
    const nounce = await provider.getTransactionCount(signer.address, 'pending');

    console.log(`Nounce: ${nounce}`);

    await signer.sendTransaction({
        to: CONTRACT_ADDRESS.WETH,
        value: ethers.utils.parseEther('5'),
        nounce: nounce
    });

    await logBalances(provider, signer, contracts);

    const tx1 = await usdt.approve(CONTRACT_ADDRESS.ROUTER, amountIn);
    await tx1.wait();

    const tx2 = await routerArtifact.swapExactTokensForTokens(
        amountIn,
        0,
        [usdt.address, weth.address],
        signer.address,
        Math.floor(Date.now() / 1000) + 60 * 10,
        { gasLimit: 1000000 }
    );

    await tx2.wait();

    await logBalances(provider, signer, contracts);
}

async function main() {

    console.log('--------------------');

    const signer = await getSigner();

    console.log(`Signer: ${signer.address}`);

    const provider = hre.ethers.provider;

    console.log(`Provider: ${provider.connection.url}`);

    const contracts = {
        router: getContractInstance(CONTRACT_ADDRESS.ROUTER, routerArtifact, signer),
        usdt: getContractInstance(CONTRACT_ADDRESS.USDT, usdtArtifact, signer),
        weth: getContractInstance(CONTRACT_ADDRESS.WETH, wethArtifact, signer)
    }

    const amountIn = ethers.utils.parseEther('1');

    await executeSwap(provider, signer, contracts, amountIn);
}

main().catch(e => {
    console.log(e);
    process.exit(1);
})