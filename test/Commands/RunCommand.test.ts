import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import RunCommand from '../../src/Command/RunCommand';
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

const command = new RunCommand(ethereumContract, ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('run <function_name> [params..]');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('execute a function');
});

test('test command execution', () => {
  ethereumContract.connect = jest.fn().mockReturnValue(null);
  ethereumUserSession.restoreWallet = jest.fn().mockReturnValue(Promise.resolve({}));
  ethereumContract.sendRunRequest = jest.fn().mockReturnValue(Promise.resolve(bigNumberify(1)));
  ethereumContract.listenResponse = jest.fn().mockReturnValue(
    Promise.resolve(JSON.stringify({ message: 'result message' })),
  );

  expect(command.exec({ function_name: 'functionName', params: ['1', '2', '3'] }))
    .resolves.toBe('result message');
});
