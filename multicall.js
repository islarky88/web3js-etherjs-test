require('dotenv').config({ path: '.env' });
const Web3 = require('web3');
const { UNI_V3_POS } = require('./abi/uniswap.js');

const fromAddress = '0x008098A525E61F932314216634597815B976853B';

// ganache
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const provider = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // testnet
// const provider = `https://mainnet.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // mainnet
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const myPrivateKey = process.env.METAMASK_PASSWORD;

const univ3pos = '0xc36442b4a4522e871399cd717abdd847ab11fe88';

const main = async () => {
    try {
        const contract = new web3.eth.Contract(UNI_V3_POS, univ3pos);

        const methods = [];

        // add mint method first
        const params = [
            '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', // token0 - InstaToken Address
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // token1 - WETH9 address
            '123', // fee
            '456', // tickLower
            '789', // tickUpper
            '249999999999999999716', // amount0Desired
            '856568008741777183', // amount1Desired
            '242154525503193061571', // amount0Min
            '831197723551503890', // amount1Min
            '0x7284a8451d9a0e7Dc62B3a71C0593eA2eC5c5638', // recipient - smart contract address of InstaToken
            '1628718978', // deadline
        ];
        const mintEncoded = contract.methods.mint(params).encodeABI();
        methods.push(mintEncoded);

        // add then refundETH next
        const refund = contract.methods.refundETH().encodeABI();
        methods.push(refund);

        const inputData = contract.methods.multicall(methods).encodeABI();

        // get current account from privkey
        const currentAccount =
            web3.eth.accounts.privateKeyToAccount(myPrivateKey);
        console.log('currentAccount', currentAccount);

        const signResult = await web3.eth.accounts.signTransaction(
            {
                to: univ3pos,
                gasPrice: '42000000000',
                gas: '80000',
                data: inputData,
            },
            myPrivateKey,
        );

        const sendResult = await web3.eth.sendSignedTransaction(
            signResult.rawTransaction,
        );
        console.log(sendResult);
    } catch (error) {
        console.log(error);
        // console.log(error.message);
    }
};

main();
