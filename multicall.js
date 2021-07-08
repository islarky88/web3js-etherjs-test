require('dotenv').config({ path: '.env' });
const Web3 = require('web3');
const { UNI_V3_POS } = require('./abi/uniswap.js');
const { MultiCall } = require('eth-multicall');

// console.log('UNI_V3_POS', UNI_V3_POS);

const fromAddress = '0x008098A525E61F932314216634597815B976853B';

// ganache
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const provider = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // testnet
// const provider = `https://mainnet.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // mainnet
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
// const multiCallContract = '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2';
// const multicall = new MultiCall(web3, multiCallContract);

const etherToSend = '0.006';

const myPrivateKey = process.env.METAMASK_PASSWORD;

const univ3pos = '0xc36442b4a4522e871399cd717abdd847ab11fe88';

const main = async () => {
    try {
        const contract = new web3.eth.Contract(UNI_V3_POS, univ3pos);

        // const result =
        //     '0x883164560000000000000000000000006f40d4a6237c257fff2db00fa0510deeecd303eb000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000bb8ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff18e8ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff264400000000000000000000000000000000000000000000000d8d726b7177a7fee40000000000000000000000000000000000000000000000000be32410cf046f1f00000000000000000000000000000000000000000000000d2091b1f49b1798c30000000000000000000000000000000000000000000000000b8901ecfa6696120000000000000000000000007284a8451d9a0e7dc62b3a71c0593ea2ec5c56380000000000000000000000000000000000000000000000000000000060e57f7f';

        // const dec = web3.eth.abi.decodeParameters(['string', 'uint256'], result);

        // console.log('dec', dec);

        // console.log('contract', contract.methods);

        const encodedFunctions = [];

        const mintMethod = {
            name: 'mint',
            type: 'function',
            inputs: [
                {
                    type: 'address', // token0
                    name: 'params.token0',
                },
                {
                    type: 'address', // token1
                    name: 'params.token1',
                },
                {
                    type: 'uint256', // amount0Desired
                    name: 'params.amount0Desired',
                },
                {
                    type: 'uint256', // amount1Desired
                    name: 'params.amount1Desired',
                },
                {
                    type: 'uint256', // amount0Min
                    name: 'params.amount0Min',
                },
                {
                    type: 'uint256', // amount1Min
                    name: 'params.amount1Min',
                },
                {
                    type: 'address', // recipient
                    name: 'params.recipient',
                },
                {
                    type: 'uint256', // deadline
                    name: 'params.deadline',
                },
            ],
        };

        const params = [
            '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb',
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            '249999999999999999716',
            '856568008741777183',
            '242154525503193061571',
            '831197723551503890',
            '0x7284a8451d9a0e7Dc62B3a71C0593eA2eC5c5638',
            '1625653119',
        ];
        const encoded = web3.eth.abi.encodeFunctionCall(mintMethod, params);

        encodedFunctions.push(encoded);

        const refund = web3.eth.abi.encodeFunctionCall(
            {
                name: 'refundETH',
                type: 'function',
                inputs: [],
            },
            [],
        );
        encodedFunctions.push(refund);

        console.log('encodedFunctions', encodedFunctions);
        const gasPrice = await web3.eth.getGasPrice();
        // console.log('gasPrice', gasPrice);
        // console.log('encoded', encoded);

        // address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256

        //  this is the multicall method from uniswap contract
        const multicall = contract.methods.multicall;

        // console.log('multicall encodedFunctions', multicall(encodedFunctions));

        // const test = await multicall(encodedFunctions).send({
        //     from: fromAddress,
        // });
        // console.log('test', test);

        // console.log('encoded', encoded);

        // // event handling for disconnect wallet
        // window.ethereum.on('disconnect', () => {
        //     console.log('disconnected');
        // });

        // // check for metamask logged in
        // web3.eth.getAccounts(function (err, accounts) {
        //     if (err != null) console.error('An error occurred: ' + err);
        //     else if (accounts.length == 0)
        //         console.log('User is not logged in to MetaMask');
        //     else console.log('User is logged in to MetaMask');
        // });

        // // const test = contract.name;
        // console.log('cotract name', contract.name);
        // console.log('cotract methods', contract.methods);
        // console.log('contract', contract);

        // const account = web3.eth.accounts.create();
        // console.log('account', account);

        // const accounts = await web3.eth.personal.getAccounts();
        // console.log('accounts', accounts);

        // get current account from privkey
        const currentAccount =
            web3.eth.accounts.privateKeyToAccount(myPrivateKey);
        // console.log('currentAccount', currentAccount);

        // // check balance
        // let balance = await web3.eth.getBalance(currentAccount.address); //Will give value in.
        // balance = Number(web3.utils.fromWei(balance));
        // console.log('Balance in ETH: ', balance);

        // const addresses = [
        //     '0x960b236A07cf122663c4303350609A66A7B288C0',
        //     '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
        // ];

        // const ABIERC20Token = '0x6f40d4a6237c257fff2db00fa0510deeecd303eb';

        // const tokens = addresses.map((address) => {
        //     const token = new web3.eth.Contract(INST_ABI, address);
        //     return {
        //         symbol: token.methods.symbol(),
        //         decimals: token.methods.decimals(),
        //     };
        // });

        // const [tokensRes] = await multiCall.all([tokens]);

        // console.log('tokensRes', tokensRes);

        const signResult = await web3.eth.accounts.signTransaction(
            {
                to: univ3pos,
                gasPrice: '20000000000',
                gas: '21000',
                from: currentAccount.address,
                value: web3.utils.toWei(etherToSend, 'ether'),
            },
            myPrivateKey,
        );

        console.log('signResult', signResult);
        console.log(signResult);

        const sendResult = await web3.eth.sendSignedTransaction(
            signResult.rawTransaction,
        );
        console.log(sendResult);
    } catch (error) {
        console.log(error.message);
    }
};

main();
