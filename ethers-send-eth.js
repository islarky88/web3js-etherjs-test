require('dotenv').config({ path: '.env' });

const { ethers, utils, BigNumber } = require('ethers');

const myPrivateKey = process.env.METAMASK_PASSWORD;
const myAddress = '0x008098A525E61F932314216634597815B976853B';
const receiverAddress = '0x53CccA398F6CD117e6aa34AB71598b8F172Bf0FF';
const amountToSend = '0.0042069';

const provider = ethers.getDefaultProvider('kovan');

const wallet = new ethers.Wallet(myPrivateKey, provider);

const main = async () => {
    const gasPrice = await wallet.getBalance();
    console.log('gasPrice', gasPrice);

    const getBlockNumber = await provider.getBlockNumber();
    console.log('getBlockNumber', getBlockNumber);

    let balance = await provider.getBalance(myAddress);
    balance = ethers.utils.formatEther(balance, 'ether');
    console.log('Balance in ETH: ', balance);

    let getAddress = await utils.getAddress(myAddress);
    console.log('getAddress', getAddress);

    // let bignum = new BigNumber(balance);
    // console.log('bignum', bignum);3

    sendEther();
};

const sendEther = async () => {
    console.log(
        `Attempting to send transaction from ${wallet.address} to ${receiverAddress}`,
    );

    // Create Tx Object
    const tx = {
        to: receiverAddress,
        value: ethers.utils.parseEther(amountToSend),
    };

    // Sign and Send Tx - Wait for Receipt
    const createReceipt = await wallet.sendTransaction(tx);
    await createReceipt.wait();
    console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

main();
