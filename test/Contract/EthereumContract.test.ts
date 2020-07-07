import { bigNumberify } from 'ethers/utils';

import EtherlessContract from '../../src/EtherlessContract/EtherlessContract';
import EthereumContract from '../../src/EtherlessContract/EthereumContract';
import BriefFunction from '../../src/EtherlessContract/BriefFunction';

const ethers = require('ethers');

jest.mock('ethers');

const ESmart = require('../../contracts/EtherlessSmart.json');

const contract = new ethers.Contract();
Object.defineProperty(contract, 'interface', {
  value: {
    parseLog: jest.fn().mockImplementation(() => ({
      values: { id: 0 },
    })),
  },
});

Object.defineProperty(contract, 'filters', {
  value: {
    resultOk: jest.fn().mockImplementation((data, id) => {}),
    resultError: jest.fn().mockImplementation((data, id) => {}),
  },
});

const ethereumContract : EtherlessContract = new EthereumContract(contract);

const briefFunction : BriefFunction = { name: 'f1', signature: '()', price: 10 };

const address : string = '0x1611Ef4B1A22ff3f3fF62Fd86b9059e3679b6212';

test('get all function', async () => {
  (contract.getFuncList as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        `{"functionArray": [${JSON.stringify(briefFunction)}]}`,
      ),
    );
  const result = await ethereumContract.getAllFunctions();
  expect(result).toEqual(Array<BriefFunction>(briefFunction));
});

test('get all functions owned', async () => {
  (contract.getOwnedList as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        `{"functionArray": [${JSON.stringify(briefFunction)}]}`,
      ),
    );

  const result = await ethereumContract.getMyFunctions(address);
  expect(result).toEqual(Array<BriefFunction>(briefFunction));
});

test('get function info', async () => {
  (contract.getInfo as jest.Mock)
    .mockReturnValue(
      Promise.resolve(
        JSON.stringify(briefFunction),
      ),
    );

  const result = await ethereumContract.getFunctionInfo('functionName');
  expect(result).toEqual(briefFunction);
});

test('send run request', async () => {
  expect(ethereumContract.sendRunRequest('funcName', 'funcParams')).resolves.toBeDefined();
});

test('send delete request', () => {
  expect(ethereumContract.sendDeleteRequest('funcName')).resolves.toBeDefined();
});

test('update description', () => {

});

test('send deploy request', () => {
  expect(ethereumContract.sendDeployRequest('funcName', 'funcSignature', 'funcDesc', 'funcCid')).resolves.toBeDefined();
});

test('listen response', () => {
  expect(ethereumContract.listenResponse(bigNumberify(10))).resolves.toBeDefined();
});
