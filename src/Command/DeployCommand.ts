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
import FileParser from '../FileParser/FileParser';
import FileManager from '../IPFS/FileManager';

const fs = require('fs');

class DeployCommand extends Command {
  command = 'deploy <function_name> <path> <description>';

  description = 'deploy a function';

  private contract : EtherlessContract;

  private fileParser : FileParser;

  private fileManager : FileManager;

  constructor(fileParser : FileParser, fileManager : FileManager,
    contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
    this.fileParser = fileParser;
    this.fileManager = fileManager;
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

    this.fileParser.parse(args.path);
    const signature : string = this.fileParser.getFunctionSignature(args.function_name);

    const sourceCode : Buffer = fs.readFileSync(args.path);

    console.log('Uploading file in IPFS');
    const CID : string = await this.fileManager.save(sourceCode);
    console.log(`File uploaded, cid: ${CID}`);

    const requestId : BigNumber = await this.contract.sendDeployRequest(
      args.function_name,
      signature,
      args.description,
      CID,
    );

    const result : string = await this.contract.listenResponse(requestId);
    return JSON.parse(result).message;
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to deploy',
      type: 'string',
    }).positional('path', {
      describe: 'relative path of the source file',
      type: 'string',
    }).positional('description', {
      describe: 'Description of the function to deploy',
      type: 'string',
    });
  }
}

export default DeployCommand;
