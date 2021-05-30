const { ethers, utils, BigNumber } = require('ethers');

let provider = ethers.getDefaultProvider('kovan');

const myAddress = '0x008098A525E61F932314216634597815B976853B';

const main = async () => {
    // console.log('provider', provider);

    let balance = await provider.getBalance(myAddress);
    console.log('balance', balance.div(10000000000).toNumber() / 10000000000);

    let getAddress = await utils.getAddress(myAddress);
    console.log('getAddress', getAddress);

    // let bignum = new BigNumber(balance);
    // console.log('bignum', bignum);
};

main();
