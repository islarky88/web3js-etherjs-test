require('dotenv').config({ path: '.env.dev' });

const Web3 = require('web3');

// const ganache = require('ganache');
// const ganache = new web3.providers.HttpProvider('http://127.0.0.1:8545');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// const testnet = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`;
// const web3 = new Web3(new Web3.providers.HttpProvider(testnet));

// console.log(web3.eth);

const main = async () => {
    // const account = web3.eth.accounts.create();
    // console.log('account', account);

    const currentAccount = web3.eth.accounts.privateKeyToAccount(
        process.env.PRIV_KEY,
    );
    console.log('currentAccount', currentAccount);

    let balance = await web3.eth.getBalance(currentAccount.address); //Will give value in.
    // balance = web3.utils.toWei(balance, 'ether');
    balance = Number(web3.utils.fromWei(balance));
    console.log(balance);

    try {
        const passw =
            'fd70870ab9ae9a6bcc0de8f8e980bf9e93299af937ee8e1706ded00f82c78d98';

        const unlockResult = await web3.eth.personal.unlockAccount(
            currentAccount.address,
            passw,
        );

        console.log('unlockResult', unlockResult);

        const toAddress = '0x0DC42c645C9115CC6a7221458f073f45E52d2Ce8'; // Address of the recipient
        const etherToSend = '0.1';
        const sendResult = await web3.eth.sendTransaction({
            to: toAddress,
            gasPrice: '20000000000',
            gas: '21000',
            from: toAddress,
            value: web3.utils.toWei(etherToSend, 'ether'),
        });

        console.log(sendResult);
    } catch (error) {
        console.log(error.message);
    }
};

main();
