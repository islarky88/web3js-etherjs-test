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

const gasBudgets = {
    price: '42000000000',
    limit: '160000',
};

const params = {
    tokenId: '74933',
    tokenAddress: '0x6f40d4a6237c257fff2db00fa0510deeecd303eb',
    recipient: '0x7284a8451d9a0e7dc62b3a71c0593ea2ec5c5638',
};

const decreaseLiquidityParams = [
    params.tokenId, // tokenId
    '178678694622401229790', // liquidity
    '173668746393071692156', // amount0Min
    '601275849210309457', // amount1Min
    '1625655794', // deadline
];

const collectParams = [
    params.tokenId, // tokenId
    '0x0000000000000000000000000000000000000000', // recipient - burn address?
    '340282366920938463463374607431768211455', // amount0Max
    '340282366920938463463374607431768211455', // amount1Max
];

const unwrapEthAmountMinimum = '601302710945574558';

const sweepTokenAmountMinimum = '173675812114047852235';

const main = async () => {
    try {
        let func;
        // pushed encodedABI should be in sequence
        let methods = [];

        // decreaseLiquidity
        func = contract.methods
            .decreaseLiquidity(decreaseLiquidityParams)
            .encodeABI();
        methods.push(func);

        //collect
        func = contract.methods.collect(collectParams).encodeABI();
        methods.push(func);

        //unwrapWETH9
        func = contract.methods
            .unwrapWETH9(
                unwrapEthAmountMinimum, // amountMinimum
                params.recipient, // recipient
            )
            .encodeABI();
        methods.push(func);

        //sweepToken
        func = contract.methods
            .sweepToken(
                params.tokenAddress, // token
                sweepTokenAmountMinimum, // amountMinimum
                params.recipient, // recipient
            )
            .encodeABI();
        methods.push(func);

        const inputData = contract.methods.multicall(methods).encodeABI();

        const signResult = await web3.eth.accounts.signTransaction(
            {
                to: univ3pos,
                gasPrice: gasBudgets.price,
                gas: gasBudgets.limit,
                data: inputData,
            },
            contractPrivateKey,
        );

        const sendResult = await web3.eth.sendSignedTransaction(
            signResult.rawTransaction,
        );
        console.log(sendResult);
    } catch (error) {
        console.log(error);
    }
};

main();
