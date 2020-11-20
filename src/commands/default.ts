import { Command, command, metadata, Options, option } from 'clime';

class COptions extends Options {
  @option({
    flag: 'l',
    description: 'affluent login',
    default: 'developertest@affluent.io',
  })
  login: string;

  @option({
    flag: 'p',
    description: 'affluent password',
    default: 'SOpcR^37',
  })
  password: string;
}
@command({ description: 'command for fetching and storing data from afflu.net' })
export default class extends Command {
  @metadata
  async execute(options: COptions) {
    return `${options.login} ${options.password}!`;
  }
}
