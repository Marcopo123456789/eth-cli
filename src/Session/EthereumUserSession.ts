import Configstore from 'configstore';
import { Wallet } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { Provider } from 'ethers/providers';

import UserSession from './UserSession';

class EthereumUserSession implements UserSession {
  private static WALLET_KEY : string = 'criptedWallet';

  private static ADDRESS_KEY : string = 'walletAddress';

  private conf : Configstore;

  private provider : Provider;

  constructor(conf : any, provider : Provider) {
    this.conf = conf;
    this.provider = provider;
  }

  private saveWallet(password : string, wallet : Wallet) : void {
    wallet.encrypt(password).then((encryptedJson : string) => {
      this.conf.set(EthereumUserSession.WALLET_KEY, encryptedJson);
    });

    this.conf.set(EthereumUserSession.ADDRESS_KEY, wallet.address);
  }

  isLogged() : boolean {
    return this.conf.get(EthereumUserSession.WALLET_KEY) !== null
      && this.conf.get(EthereumUserSession.WALLET_KEY) !== undefined;
  }

  loginWithPrivateKey(privateKey : string, password : string) : Wallet {
    if (this.isLogged()) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = new Wallet(privateKey);
    this.saveWallet(password, wallet);
    return wallet;
  }

  loginWithMnemonicPhrase(mnemonic : string, password: string) : Wallet {
    if (this.isLogged()) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = Wallet.fromMnemonic(mnemonic);
    this.saveWallet(password, wallet);
    return wallet;
  }

  signup() : Wallet {
    return Wallet.createRandom();
  }

  logout() : void {
    if (this.isLogged()) {
      this.conf.delete(EthereumUserSession.WALLET_KEY);
    } else {
      throw new Error('You are not logged in!');
    }
  }

  async restoreWallet(password:string) : Promise<Wallet> {
    if (this.isLogged()) {
      const wallet : Wallet = await Wallet.fromEncryptedJson(
        this.conf.get(EthereumUserSession.WALLET_KEY),
        password,
      );

      return wallet.connect(this.provider);
    }

    throw new Error('No wallet found');
  }

  getAddress() : string {
    if (this.isLogged()) {
      return this.conf.get(EthereumUserSession.ADDRESS_KEY);
    }

    throw new Error('No user logged in');
  }
}

export default EthereumUserSession;
