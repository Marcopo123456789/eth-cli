import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import SearchCommand from '../../src/Command/SearchCommand';
import EthereumContract from '../../src/EtherlessContract/EthereumContract';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

jest.mock('../../src/EtherlessContract/EthereumContract');
jest.mock('../../src/Session/EthereumUserSession');
jest.mock('ethers');
jest.mock('yargs');
jest.mock('configstore');
jest.mock('inquirer');

const inquirer = require('inquirer');

inquirer.prompt = jest.fn().mockReturnValue(Promise.resolve('password'));

const ethers = require('ethers');

const yargs = require('yargs');
yargs.positional = jest.fn().mockReturnValue(require('yargs'));

const contract = new ethers.Contract();

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const ethereumContract = new EthereumContract(contract);
const ethereumUserSession = new EthereumUserSession(
  cfgStore,
  ethers.getDefaultProvider('ropsten'),
);

const command = new SearchCommand(ethereumContract, ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('search <keyword>');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('list all functions having a keyword inside their name');
});

test('no function containing the keyword', () => {
  (ethereumContract.getAllFunctions as jest.Mock).mockReturnValueOnce([]);

  expect(command.exec({ keyword: 'test' }))
    .resolves.toBe('Functions containing keyword "test" inside their name: \nNo function found');
});

test('no function containing the keyword', () => {
  (ethereumContract.getAllFunctions as jest.Mock).mockReturnValueOnce([
    { name: 'test0', signature: '()', price: 10 },
    { name: 'mock', signature: '(n1)', price: 20 },
  ]);

  expect(command.exec({ keyword: 'test' }))
    .resolves.toBe('Functions containing keyword "test" inside their name: \n- Function: test0() Price: 10');
});
