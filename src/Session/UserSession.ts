import { Wallet } from 'ethers';

export default interface UserSession {
  isLogged() : boolean;
  loginWithPrivateKey(privateKey : string, password : string) : Wallet;
  loginWithMnemonicPhrase(mnemonic : string, password: string) : Wallet;
  signup() : Wallet;
  logout() : void;
  restoreWallet(password : string) : Promise<Wallet>;
  getAddress() : string;
}
