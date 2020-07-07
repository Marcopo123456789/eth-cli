import { Argv } from 'yargs';
import { Wallet } from 'ethers';

import Command from './Command';

const fs = require('fs');

class SignupCommand extends Command {
  command = 'signup [save]';

  description = 'create a new account';

  async exec(args: any) : Promise<any> {
    const wallet : Wallet = this.session.signup();

    if (args.save) {
      fs.writeFileSync('./credential.txt', `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`);
    }

    return `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`;
  }

  builder(yargs : Argv) : any {
    return yargs.option('save', {
      describe: 'Decide if save credentials in file',
      type: 'boolean',
      default: false,
    });
  }
}

export default SignupCommand;
