import { bigNumberify } from 'ethers/utils';

import * as fs from 'fs';
import Configstore from 'configstore';
import SignupCommand from '../../src/Command/SignupCommand';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

jest.mock('../../src/Session/EthereumUserSession');
jest.mock('ethers');
jest.mock('yargs');
jest.mock('configstore');
// jest.mock('fs');

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

const command = new SignupCommand(ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('signup [save]');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('create a new account');
});

test('test signup without saving account', () => {
  (ethereumUserSession.signup as jest.Mock).mockImplementationOnce(() => ({
    address: 'mockAddress',
    privateKey: 'mockPrivateKey',
    mnemonic: 'mockMnemonic',
  }));
  // (fs.writeFileSync as jest.Mock).mockImplementationOnce(() => {});

  expect(command.exec({ save: true })).resolves
    .toBe('Address: mockAddress \nPrivate Key: mockPrivateKey \nMnemonic phrase: mockMnemonic');
});

test('test signup without saving account', () => {
  (ethereumUserSession.signup as jest.Mock).mockImplementationOnce(() => ({
    address: 'mockAddress',
    privateKey: 'mockPrivateKey',
    mnemonic: 'mockMnemonic',
  }));

  expect(command.exec({ save: false })).resolves
    .toBe('Address: mockAddress \nPrivate Key: mockPrivateKey \nMnemonic phrase: mockMnemonic');
});

afterAll(() => {
  fs.unlinkSync('credential.txt');
});
