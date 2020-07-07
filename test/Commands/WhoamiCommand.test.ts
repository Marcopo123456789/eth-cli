import { bigNumberify } from 'ethers/utils';

import Configstore from 'configstore';
import WhoamiCommand from '../../src/Command/WhoamiCommand';
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

const command = new WhoamiCommand(ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('whoami');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('show current wallet address');
});

test('test login with mnemonic phrase', () => {
  ethereumUserSession.getAddress = jest.fn().mockReturnValue('mockAddress');
  expect(command.exec({})).resolves.toBe('Current user address: mockAddress');
});
