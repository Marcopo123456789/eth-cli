import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import InitCommand from '../../src/Command/InitCommand';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

jest.mock('../../src/Session/EthereumUserSession');
jest.mock('ethers');
jest.mock('yargs');
jest.mock('configstore');

const inquirer = require('inquirer');

inquirer.prompt = jest.fn().mockReturnValue(Promise.resolve('password'));

const ethers = require('ethers');

const yargs = require('yargs');

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const ethereumUserSession = new EthereumUserSession(
  cfgStore,
  ethers.getDefaultProvider('ropsten'),
);

const command = new InitCommand(ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('init');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('Functionality showcase');
});

test('test login with mnemonic phrase', () => {
  expect(command.exec({})).resolves.toBeDefined();
});

test('test login with private key', () => {
  expect(command.builder(yargs)).toBeDefined();
});
