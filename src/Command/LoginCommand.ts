import { Argv } from 'yargs';
import { Wallet } from 'ethers';

import * as Inquirer from 'inquirer';
import Command from './Command';

class LoginCommand extends Command {
  command = 'login [m] <value..>';

  description = 'login inside Ethereum network';

  async exec(args: any) : Promise<string> {
    const password : string = await Inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to encrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    const value : string = args.value.join(' ');
    const wallet : Wallet = args.m
      ? this.session.loginWithMnemonicPhrase(value, password)
      : this.session.loginWithPrivateKey(value, password);

    return `Login successfully done within the Ethereum network with address ${wallet.address}`;
  }

  builder(yargs : Argv) : any {
    return yargs.positional('value', {
      describe: 'Value to access the wallet, it can be a private key or mnemonic phrase',
    }).option('m', {
      describe: 'If true value must be a mnemonic phrase',
      type: 'boolean',
    });
  }
}

export default LoginCommand;
