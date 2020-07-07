import { ethers, Contract, getDefaultProvider, Wallet } from 'ethers';
import { BigNumber } from 'ethers/utils';

const ESmart = require('../contracts/EtherlessSmart.json');


const func = async () => {
  const wallet : Wallet = new Wallet('0x326712c09375d35e396b0cd80bc7002f13cd227b70e1959686f28ca994a28635', getDefaultProvider('ropsten'));

  const contract : Contract = new Contract('0x5f95F9FC6345C8f6CC94D154e3C6212722660146',
    ESmart.abi,
    getDefaultProvider('ropsten')).connect(wallet);

  contract.on('runRequest', (funcName : string, param : string, id : BigNumber) => {
    console.log(id);
    contract.resultFunction('100', id, { gasLimit: 750000 }).then((tx : any) => tx.wait());
  });
};

func();
