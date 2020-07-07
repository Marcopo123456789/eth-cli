import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import LoginCommand from '../../src/Command/LoginCommand';
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

const command = new LoginCommand(ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('login [m] <value..>');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('login inside Ethereum network');
});

test('test login with mnemonic phrase', () => {
  ethereumUserSession.loginWithMnemonicPhrase = jest.fn().mockReturnValue({ address: 'mockAddress' });
  expect(command.exec({ value: ['m1', 'm2', 'm3'], m: true }))
    .resolves.toBe('Login successfully done within the Ethereum network with address mockAddress');
});

test('test login with private key', () => {
  ethereumUserSession.loginWithPrivateKey = jest.fn().mockReturnValue({ address: 'mockAddress' });
  expect(command.exec({ value: ['privateKey'], m: false }))
    .resolves.toBe('Login successfully done within the Ethereum network with address mockAddress');
});
