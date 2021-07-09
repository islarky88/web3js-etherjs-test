require('dotenv').config({ path: '.env' });
const Web3 = require('web3');
const { UNI_V3_POS } = require('./abi/uniswap.js');

const fromAddress = '0x008098A525E61F932314216634597815B976853B';

const provider = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // testnet
// const provider = `https://mainnet.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // mainnet
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const contractPrivateKey = process.env.CONTRACT_PRIVATE_KEY;

const univ3pos = '0xc36442b4a4522e871399cd717abdd847ab11fe88';

const contract = new web3.eth.Contract(UNI_V3_POS, univ3pos);

const etherToSend = '0.001';

const gasBudgets = {
    price: '42000000000',
    limit: '300000',
};

// original data from https://etherscan.io/tx/0x38765aaea94fc5d2220721319f9af7df509d4d8142727a5127388c31262f54d3
// fee, tickLower and tickUpper is currently unknown based on TX
let mintParams = [
    '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', // token0 - InstaToken Address
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // token1 - WETH9 address
    '5', // fee
    '0', // tickLower
    '0', // tickUpper
    '249999999999999999716', // amount0Desired
    '856568008741777183', // amount1Desired
    '242154525503193061571', // amount0Min
    '831197723551503890', // amount1Min
    '0x7284a8451d9a0e7Dc62B3a71C0593eA2eC5c5638', // recipient - address to receive token
    '1625653119', // deadline
];

const initializeParams = [
    '0x6182d4F98a00CB75a9cbC4A30c16706476e622AC', // token0 - InstaToken Address
    '0xd0A1E359811322d97991E03f863a0C30C2cF029C', // token1 - WETH9 address
    '500', // fee
    '2505413655765166104103837312489',
];

// override for testing
mintParams = [
    '0x6182d4F98a00CB75a9cbC4A30c16706476e622AC', // token0 - InstaToken Address
    '0xd0A1E359811322d97991E03f863a0C30C2cF029C', // token1 - WETH9 address
    '500', // fee
    '69080', // tickLower
    '76010', // tickUpper
    '23369122532134', // amount0Desired
    '100000000000000', // amount1Desired
    '23169755070570', // amount0Min
    '0', // amount1Min
    '0x008098a525e61f932314216634597815b976853b', // recipient - address to receive token
    '1625894860', // deadline
];

const main = async () => {
    try {
        methods = [];

        // // add mint method first
        // func = contract.methods
        //     .createAndInitializePoolIfNecessary(...initializeParams)
        //     .encodeABI();
        // methods.push(func);

        // add mint method first
        func = contract.methods.mint(mintParams).encodeABI();
        methods.push(func);

        // add then refundETH next
        func = contract.methods.refundETH().encodeABI();
        methods.push(func);

        const inputData = contract.methods.multicall(methods).encodeABI();

        const signResult = await web3.eth.accounts.signTransaction(
            {
                to: univ3pos,
                gasPrice: gasBudgets.price,
                gas: gasBudgets.limit,
                data: inputData,
                value: web3.utils.toWei(etherToSend, 'ether'),
            },
            contractPrivateKey,
        );

        const sendResult = await web3.eth.sendSignedTransaction(
            signResult.rawTransaction,
        );
        console.log(sendResult);
        console.log('SUCCESS');
    } catch (error) {
        console.log(error);
        console.log('----FAIL----');
    }
};

main();
