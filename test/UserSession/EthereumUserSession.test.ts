import Configstore from 'configstore';
import UserSession from '../../src/Session/UserSession';
import EthereumUserSession from '../../src/Session/EthereumUserSession';

const ethers = require('ethers');

jest.mock('ethers');

jest.mock('configstore');

const pkg = require('../../package.json');

const cfgStore = new Configstore(pkg.name);

const privateKey : string = '0x2bbd8f70ee60484124e3575a06e14527a82d0cca16cb162a1d9ef5df11440e60';
const mnemonic : string = 'apple inner trash finger buyer tomorrow abstract donate donor caught high weird';
const password : string = 'password';

const userSession : UserSession = new EthereumUserSession(cfgStore, ethers.getDefaultProvider('ropsten'));

test('Login with PrivateKey', () => {
  (cfgStore.set as jest.Mock).mockImplementationOnce(
    (key, value) => 'stored',
  );

  (cfgStore.get as jest.Mock).mockImplementationOnce(
    (key) => null,
  );

  expect(() => userSession.loginWithPrivateKey(privateKey, password)).not.toThrowError();
});

test('Login with Mnemonic', () => {
  (cfgStore.set as jest.Mock).mockImplementationOnce(
    (key, value) => 'stored',
  );

  (cfgStore.get as jest.Mock).mockImplementationOnce(
    (key) => null,
  );

  ethers.Wallet.fromMnemonic = jest.fn().mockImplementation(() => new ethers.Wallet());
  expect(() => userSession.loginWithMnemonicPhrase(mnemonic, password)).not.toThrowError();
});

test('Login with private key in wrong format', () => {
  (cfgStore.get as jest.Mock).mockImplementationOnce(
    (key) => null,
  );

  ethers.Wallet = jest.fn().mockImplementationOnce(
    () => new Error('Private key in wrong format'),
  );

  expect(() => userSession.loginWithPrivateKey('privateKeyInWrongFormat', password)).toThrowError();
});

test('Login with mnemonic phrase in wrong format', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  ethers.Wallet.fromMnemonic = jest.fn().mockImplementationOnce(
    (menmonic : string) => new Error('Mnemonic phrase in wrong format'),
  );

  expect(() => userSession.loginWithMnemonicPhrase('mnemonicInWrongFormat', password)).toThrowError();
});

test('Tring login with already logged user (private key)', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedEncryptedWallet');
  expect(() => userSession.loginWithPrivateKey(privateKey, password)).toThrowError();
});

test('Tring login with already logged user (mnemonic phrase)', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedEncryptedWallet');
  expect(() => userSession.loginWithMnemonicPhrase(mnemonic, password)).toThrowError();
});

test('Logout', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedEncryptedWallet');
  expect(() => userSession.logout()).not.toThrowError();
});

test('Logout with no user logged', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(() => userSession.logout()).toThrowError();
});

test('create new wallet', () => {
  ethers.Wallet.createRandom = jest.fn().mockImplementationOnce(() => {});
  expect(() => userSession.signup()).not.toThrowError();
});

test('Get address', () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mockedAddress');
  expect(userSession.getAddress()).toEqual('mockedAddress');
});

test('Get address from not logged user', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(() => userSession.getAddress()).toThrowError();
});

test('Restore wallet from not logged user', () => {
  (cfgStore.get as jest.Mock).mockReturnValue(null);
  expect(userSession.restoreWallet(password)).rejects.toThrowError();
});

test('Restore wallet', async () => {
  (cfgStore.get as jest.Mock).mockReturnValue('mocked encrypted wallet');
  ethers.Wallet.fromEncryptedJson = jest.fn().mockImplementationOnce(
    (encryptedJson) => Promise.resolve({
      connect: jest.fn().mockImplementation(() => new ethers.Wallet()),
    }),
  );

  expect(userSession.restoreWallet(password)).resolves.toBeDefined();
});
