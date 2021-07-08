require('dotenv').config({ path: '.env' });
const Web3 = require('web3');
const { UNI_V3_POS } = require('./abi/uniswap.js');

const fromAddress = '0x008098A525E61F932314216634597815B976853B';

const provider = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // testnet
// const provider = `https://mainnet.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // mainnet

const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const myPrivateKey = process.env.METAMASK_PASSWORD;

const univ3pos = '0xc36442b4a4522e871399cd717abdd847ab11fe88';

const contract = new web3.eth.Contract(UNI_V3_POS, univ3pos);

const main = async () => {
    try {
        let func;
        // pushed encodedABI should be in sequence
        let methods = [];

        // decreaseLiquidity
        func = contract.methods
            .decreaseLiquidity([
                '74933', // tokenId
                '178678694622401229790', // liquidity
                '173668746393071692156', // amount0Min
                '601275849210309457', // amount1Min
                '1625655794', // deadline
            ])
            .encodeABI();
        methods.push(func);

        //collect
        func = contract.methods
            .collect([
                '74933', // tokenId
                '0x0000000000000000000000000000000000000000', // recipient
                '340282366920938463463374607431768211455', // amount0Max
                '340282366920938463463374607431768211455', // amount1Max
            ])
            .encodeABI();
        methods.push(func);

        //unwrapWETH9
        func = contract.methods
            .unwrapWETH9(
                '601302710945574558', // amountMinimum
                '0x7284a8451d9a0e7dc62b3a71c0593ea2ec5c5638', // recipient
            )
            .encodeABI();
        methods.push(func);

        //sweepToken
        func = contract.methods
            .sweepToken(
                '0x6f40d4a6237c257fff2db00fa0510deeecd303eb', // token
                '173675812114047852235', // amountMinimum
                '0x7284a8451d9a0e7dc62b3a71c0593ea2ec5c5638', // recipient
            )
            .encodeABI();
        methods.push(func);

        const inputData = contract.methods.multicall(methods).encodeABI();

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
        res.send(sendResult);
    } catch (error) {
        console.log(error);
    }
};

main();
