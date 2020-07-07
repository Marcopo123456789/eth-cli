import { Argv } from 'yargs';
import {
  ethers,
  Contract,
  getDefaultProvider,
  EventFilter,
  Wallet,
} from 'ethers';
import { BigNumber } from 'ethers/utils';
import * as inquirer from 'inquirer';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

import Command from './Command';

class RunCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    const requestId : BigNumber = await this.contract.sendRunRequest(
      args.function_name,
      args.params.toString(),
    );

    const result : string = await this.contract.listenResponse(requestId);
    return JSON.parse(result).message;
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to execute',
      type: 'string',
    }).option('params', {
      describe: 'Array of params to use for the execution',
      type: 'array',
    });
  }
}

export default RunCommand;
