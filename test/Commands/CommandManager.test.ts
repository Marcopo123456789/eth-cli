import Configstore from 'configstore';
import { Argv } from 'yargs';
import CommandManager from '../../src/Command/CommandManager';
import Command from '../../src/Command/Command';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

jest.mock('ethers');
jest.mock('yargs');
jest.mock('../../src/Session/EthereumUserSession');
jest.mock('configstore');

const ethers = require('ethers');
const yargs = require('yargs');

yargs.positional = jest.fn().mockReturnValue(require('yargs'));

yargs.parse = jest.fn().mockImplementation();
yargs.command = jest.fn().mockImplementation();

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const ethereumUserSession = new EthereumUserSession(
  cfgStore,
  ethers.getDefaultProvider('ropsten'),
);


class MockCommand extends Command {
  exec(args: any) : Promise<string> { return Promise.resolve('mocked result'); }

  builder(yargs : Argv) : any { return {}; }
}

test('insert of a new command', () => {
  const mockCommand : MockCommand = new MockCommand(ethereumUserSession);
  expect(() => CommandManager.addCommand(mockCommand)).not.toThrowError();
});

test('init of command manager', () => {
  expect(() => CommandManager.init()).not.toThrowError();
});
