const { ethers, utils, BigNumber } = require('ethers');

let provider = ethers.getDefaultProvider('kovan');
const signer = provider.getSigner();

const myAddress = '0x008098A525E61F932314216634597815B976853B';
const receiver = '0x53CccA398F6CD117e6aa34AB71598b8F172Bf0FF';

const main = async () => {
    // console.log('provider', provider);

    const tx = signer.sendTransaction({
        to: 'ricmoo.firefly.eth',
        value: ethers.utils.parseEther('1.0'),
    });

    console.log('tx', tx);

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
