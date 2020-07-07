import { Argv } from 'yargs';
import {
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

class EditCommand extends Command {
  command = 'edit <function_name> [s] [d]';

  description = 'edit a function you deployed';

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

  async exec(args: any) : Promise<any> {
    const password : string = await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    const wallet : Wallet = await this.session.restoreWallet(password);
    this.contract.connect(wallet);

    let commandOutput = '';

    if (args.s) {
      // message = `${message} \n - Source: ${args.s}`;
      this.fileParser.parse(args.s);
      const signature : string = this.fileParser.getFunctionSignature(args.function_name);

      const sourceCode : Buffer = fs.readFileSync(args.s);

      console.log('Uploading file in IPFS');
      const CID : string = await this.fileManager.save(sourceCode);
      console.log(`File uploaded, cid: ${CID}`);

      const requestId : BigNumber = await this.contract.sendCodeUpdateRequest(
        args.function_name,
        signature,
        CID,
      );

      const result : string = await this.contract.listenResponse(requestId);
      commandOutput += `${JSON.parse(result).message}\n`;
    }

    if (args.d) {
      //  message = `${message} \n - Description: ${args.d}`;
      await this.contract.updateDesc(args.function_name, args.d);
      commandOutput += 'Description updated correctly\n';
    }

    return commandOutput;
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to edit',
      type: 'string',
    }).option('s', {
      describe: 'relative path of the source file',
      type: 'string',
    }).option('d', {
      describe: 'description of the function you want to edit',
      type: 'string',
    });
  }
}

export default EditCommand;
