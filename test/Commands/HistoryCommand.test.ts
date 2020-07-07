import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import HistoryCommand from '../../src/Command/HistoryCommand';
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

const command = new HistoryCommand(ethereumContract, ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('history [limit]');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('get a list of your past executions');
});

test('history with no past element', () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.getAddress = jest.fn().mockReturnValue(Promise.resolve('mockedAddress'));
  ethereumContract.getExecHistory = jest.fn().mockReturnValue(Promise.resolve([]));

  expect(command.exec({ limit: 10 }))
    .resolves.toBe('No past executions found');
});

test('history with past element', () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.getAddress = jest.fn().mockReturnValue(Promise.resolve('mockedAddress'));
  ethereumContract.getExecHistory = jest.fn().mockReturnValue(Promise.resolve([
    { date: 'mockDate', name: 'sum', params: '5, 4', result: '9' }
  ]));

  expect(command.exec({ limit: 10 }))
    .resolves.toBe('- Date: mockDate - Function: sum - Params: 5, 4 - Result: 9');
});
