import Configstore from 'configstore';
import InfoCommand from '../../src/Command/InfoCommand';
import EthereumContract from '../../src/EtherlessContract/EthereumContract';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

jest.mock('../../src/EtherlessContract/EthereumContract');
jest.mock('../../src/Session/EthereumUserSession');
jest.mock('ethers');
jest.mock('yargs');
jest.mock('configstore');

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

const command = new InfoCommand(ethereumContract, ethereumUserSession);

test('check builder', () => {
  expect(command.builder(yargs)).toBeDefined();
});

test('get command syntax', () => {
  expect(command.getCommand()).toBe('info <function_name>');
});

test('get command description', () => {
  expect(command.getDescription()).toBe('info of a specific function inside Etherless platform');
});

test('command execution with no user logged', () => {
  ethereumUserSession.isLogged = jest.fn().mockReturnValue(false);
  expect(command.exec({ function_name: 'mockedFunction' }))
    .rejects.toBeInstanceOf(Error);
});

test('test command execution', () => {
  ethereumUserSession.isLogged = jest.fn().mockReturnValue(true);
  ethereumContract.getFunctionInfo = jest.fn().mockReturnValue(Promise.resolve({
    name: 'function',
    owner: 'owner',
    signature: 'signature',
    price: 'price',
    description: 'description',
  }));

  expect(command.exec({ function_name: 'functionName' }))
    .resolves.toBeDefined();
});
