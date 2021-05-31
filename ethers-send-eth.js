require('dotenv').config({ path: '.env.dev' });

const { ethers, utils, BigNumber } = require('ethers');

let provider = ethers.getDefaultProvider('kovan');

const myPrivateKey = process.env.METAMASK_PASSWORD;
const myAddress = '0x008098A525E61F932314216634597815B976853B';
const receiver = '0x53CccA398F6CD117e6aa34AB71598b8F172Bf0FF';

const main = async () => {
    // console.log('provider', provider);

    const wallet = new ethers.Wallet(myPrivateKey, provider);

    console.log(wallet);

    const gasPrice = await wallet.getBalance();
    console.log('gasPrice', gasPrice);

    let balance = await provider.getBalance(myAddress);
    balance = ethers.utils.formatEther(balance, 'ether');
    console.log('Balance in ETH: ', balance);

    let getAddress = await utils.getAddress(myAddress);
    console.log('getAddress', getAddress);

    // let bignum = new BigNumber(balance);
    // console.log('bignum', bignum);3

    // Acccounts now exposed
    const params = [
        {
            from: myAddress,
            to: receiver,
            value: ethers.utils.parseUnits('0.0006', 'ether').toHexString(),
        },
    ];

    const transactionHash = await provider.send('eth_sendTransaction', params);
    console.log('transactionHash is ' + transactionHash);
};

main();
