import { Argv } from 'yargs';
import Command from './Command';
import BriefFunction from '../EtherlessContract/BriefFunction';
import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const address : string = this.session.getAddress();
    const resDesc : string = args.m ? `Displaying all functions owned by current user: (address: ${address})\n`
      : 'Displaying all functions inside Etherless platform:\n';

    const list : Array<BriefFunction> = args.m
      ? await this.contract.getMyFunctions(address)
      : await this.contract.getAllFunctions();

    return resDesc + (list.length === 0
      ? 'No function found'
      : list.map((item : BriefFunction) => `- Function: ${item.name}${item.signature} Price: ${item.price}`).join('\n'));
  }

  builder(yargs : Argv) : any {
    return yargs.option('m', {
      describe: 'Display only functions owns by the current user',
      type: 'boolean',
      default: false,
    });
  }
}

export default ListCommand;
