require('dotenv').config({ path: '.env' });
const Web3 = require('web3');

// ganache
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const testnet = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`;
const web3 = new Web3(new Web3.providers.HttpProvider(testnet));

// amount of ether to send and to whom
const toAddress = '0x53CccA398F6CD117e6aa34AB71598b8F172Bf0FF'; // Address of the recipient
const etherToSend = '0.006';

const myPrivateKey = process.env.METAMASK_PASSWORD;

const main = async () => {
    // const account = web3.eth.accounts.create();
    // console.log('account', account);

    // const accounts = await web3.eth.personal.getAccounts();
    // console.log('accounts', accounts);

    // get current account from privkey
    const currentAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKey);
    console.log('currentAccount', currentAccount);

    // check balance
    let balance = await web3.eth.getBalance(currentAccount.address); //Will give value in.
    balance = Number(web3.utils.fromWei(balance));
    console.log('Balance in ETH: ', balance);

    try {
        // const unlockResult = await web3.eth.personal.unlockAccount(
        //     currentAccount.address,
        //     myPrivateKey,
        // );
        // console.log('unlockResult', unlockResult);

        const signResult = await web3.eth.accounts.signTransaction(
            {
                to: toAddress,
                gasPrice: '20000000000',
                gas: '21000',
                from: currentAccount.address,
                value: web3.utils.toWei(etherToSend, 'ether'),
            },
            myPrivateKey,
        );
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
