import { Argv } from 'yargs';

import UserSession from '../Session/UserSession';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import BriefFunction from '../EtherlessContract/BriefFunction';

import Command from './Command';

class SearchCommand extends Command {
  command = 'search <keyword>';

  description = 'list all functions having a keyword inside their name';

  private contract : EtherlessContract;

  constructor(contract : EtherlessContract, session : UserSession) {
    super(session);
    this.contract = contract;
  }

  async exec(args: any) : Promise<string> {
    const resIntro : string = `Functions containing keyword "${args.keyword}" inside their name: \n`;
    const list : Array<BriefFunction> = await this.contract.getAllFunctions();
    const filteredList : Array<BriefFunction> = list.filter(
      (item : BriefFunction) => item.name.includes(args.keyword),
    );

    return resIntro + (filteredList.length === 0
      ? 'No function found'
      : filteredList.map((item : BriefFunction) => `- Function: ${item.name}${item.signature} Price: ${item.price}`).join('\n'));
  }

  builder(yargs : Argv) : any {
    return yargs.positional('keyword', {
      describe: 'Keyword to find inside functions name',
      type: 'string',
    });
  }
}

export default SearchCommand;
