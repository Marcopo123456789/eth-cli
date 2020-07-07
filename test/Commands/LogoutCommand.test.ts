import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import LogoutCommand from '../../src/Command/LogoutCommand';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

jest.mock('../../src/Session/EthereumUserSession');
jest.mock('ethers');
jest.mock('yargs');
jest.mock('configstore');

const inquirer = require('inquirer');

inquirer.prompt = jest.fn().mockReturnValue(Promise.resolve('password'));

const ethers = require('ethers');

const yargs = require('yargs');
yargs.positional = jest.fn().mockReturnValue(require('yargs'));
yargs.option = jest.fn().mockReturnValue(require('yargs'));

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const ethereumUserSession = new EthereumUserSession(
  cfgStore,
  ethers.getDefaultProvider('ropsten'),
);

const command = new LogoutCommand(ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('logout');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('logout from Ethereum network');
});

test('test logout command execution', () => {
  ethereumUserSession.logout = jest.fn().mockReturnValue(null);
  expect(command.exec({}))
    .resolves.toBe('Logout from Ethereum network successfully done');
});
