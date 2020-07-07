import { Argv } from 'yargs';
import Command from './Command';

class LogoutCommand extends Command {
  command = 'logout';

  description = 'logout from Ethereum network';

  async exec(args: any) : Promise<string> {
    this.session.logout();
    return 'Logout from Ethereum network successfully done';
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default LogoutCommand;
