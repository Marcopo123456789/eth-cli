import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import ListCommand from '../../src/Command/ListCommand';
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
yargs.option = jest.fn().mockReturnValue(require('yargs'));

const contract = new ethers.Contract();

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const ethereumContract = new EthereumContract(contract);
const ethereumUserSession = new EthereumUserSession(
  cfgStore,
  ethers.getDefaultProvider('ropsten'),
);

const command = new ListCommand(ethereumContract, ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('list [m]');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('list functions inside Etherless platform');
});

test('get all functions inside platform', () => {
  (ethereumUserSession.getAddress as jest.Mock).mockReturnValueOnce('mockedAddress');
  (ethereumContract.getAllFunctions as jest.Mock).mockReturnValueOnce([
    { name: 'function1', price: 10 },
    { name: 'function2', price: 10 },
  ]);

  expect(command.exec({ m: false })).resolves.toBeDefined();
});

test('no functions inside the platform', () => {
  (ethereumUserSession.getAddress as jest.Mock).mockReturnValueOnce('mockedAddress');
  (ethereumContract.getAllFunctions as jest.Mock).mockReturnValueOnce([]);

  expect(command.exec({ m: false })).resolves.toBe('Displaying all functions inside Etherless platform:\nNo function found');
});

test('get all deployed fuunctions by current user', () => {
  (ethereumUserSession.getAddress as jest.Mock).mockReturnValueOnce('mockedAddress');
  (ethereumContract.getMyFunctions as jest.Mock).mockReturnValueOnce([
    { name: 'function1', price: 10 },
    { name: 'function2', price: 10 },
  ]);

  expect(command.exec({ m: true })).resolves.toBeDefined();
});

test('no function deployed by current user', () => {
  (ethereumUserSession.getAddress as jest.Mock).mockReturnValueOnce('mockedAddress');
  (ethereumContract.getMyFunctions as jest.Mock).mockReturnValueOnce([]);

  expect(command.exec({ m: true })).resolves.toBe('Displaying all functions owned by current user: (address: mockedAddress)\nNo function found');
});

