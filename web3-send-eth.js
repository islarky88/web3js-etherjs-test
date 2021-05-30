const Web3 = require('web3');

const testnet = `https://kovan.infura.io/v3/2a98a1e540c64ec8904e8c056e2e5fc2`;
const web3 = new Web3(new Web3.providers.HttpProvider(testnet));

// console.log(web3.eth);

const main = async () => {
    const account = web3.eth.accounts.create();
    console.log('account', account);

    const currentAccount = web3.eth.accounts.privateKeyToAccount(
        '0x71ed7f7d5488f6f27ce7da610ded762d6f1d39f5ce0b861bc826b040182e0be0',
    );
    console.log('currentAccount', currentAccount);

    try {
        const ownerAddress = '0x008098A525E61F932314216634597815B976853B';
        const passw =
            'fd70870ab9ae9a6bcc0de8f8e980bf9e93299af937ee8e1706ded00f82c78d98';

        web3.eth.personal.unlockAccount(ownerAddress, passw);

        const toAddress = '0x2682c0bA7cdb28A59DD872f9f060e973fff9532E'; // Address of the recipient
        const amount = '2'; // Willing to send 2 ethers
        const amountToSend = web3.utils.toWei(amount, 'ether'); // Convert to wei value
        var send = web3.eth.sendTransaction({
            from: addr,
            to: toAddress,
            value: amountToSend,
        });
    } catch (error) {
        console.log(error.message);
    }
};

main();
