require('dotenv').config({ path: '.env' });
const Web3 = require('web3');
const { UNI_V3_POS } = require('./abi/uniswap.js');
const { MultiCall } = require('eth-multicall');

console.log('UNI_V3_POS', UNI_V3_POS);


// ganache
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// const provider = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // testnet
const provider = `https://mainnet.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`; // mainnet
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
// const multiCallContract = '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2';
// const multicall = new MultiCall(web3, multiCallContract);

const univ3pos = '0xc36442b4a4522e871399cd717abdd847ab11fe88';


const main = async () => {



  const contract = new web3.eth.Contract(UNI_V3_POS, univ3pos);
  
  // console.log('contract', contract.methods);

  const encoded = web3.eth.abi.encodeFunctionSignature({
      name: 'myMethod',
      type: 'function',
      inputs: [
          {
              type: 'uint256',
              name: 'myNumber',
          },
          {
              type: 'string',
              name: 'myString',
          },
      ],
  });

  const multicall = contract.methods.multicall;

  console.log('multicall', multicall);

  console.log('encoded', encoded);

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
    // const currentAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKey);
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

    // try {
    //     const signResult = await web3.eth.accounts.signTransaction(
    //         {
    //             to: toAddress,
    //             gasPrice: '20000000000',
    //             gas: '21000',
    //             from: currentAccount.address,
    //             value: web3.utils.toWei(etherToSend, 'ether'),
    //         },
    //         myPrivateKey,
    //     );
    //     console.log(signResult);

    //     const sendResult = await web3.eth.sendSignedTransaction(
    //         signResult.rawTransaction,
    //     );
    //     console.log(sendResult);
    // } catch (error) {
    //     console.log(error.message);
    // }
};

main();
