import { Argv } from 'yargs';

import Command from './Command';

class WhoAmICommand extends Command {
  command = 'whoami';

  description = 'show current wallet address';

  async exec(args: any) : Promise<string> {
    return `Current user address: ${this.session.getAddress()}`;
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default WhoAmICommand;
