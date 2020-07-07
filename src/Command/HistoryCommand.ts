import { Argv } from 'yargs';
import {
  ethers,
  Contract,
  getDefaultProvider,
  EventFilter,
  Wallet,
} from 'ethers';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import HistoryItem from '../EtherlessContract/HistoryItem';

import Command from './Command';

class HistoryCommand extends Command {
  command = 'history [limit]';

  description = 'get a list of your past executions';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const address : string = await this.session.getAddress();
    let history = await this.contract.getExecHistory(address);

    if (args.limit && args.limit > 0) history = history.slice(0, args.limit);

    return history.length === 0
      ? 'No past executions found'
      : history.map((item : HistoryItem) => `- Date: ${item.date} - Function: ${item.name} - Params: ${item.params} - Result: ${item.result}`).join('\n');
  }

  builder(yargs : Argv) : any {
    return yargs.option('limit', {
      describe: 'Maximum number of item to show',
      type: 'number',
    });
  }
}

export default HistoryCommand;
