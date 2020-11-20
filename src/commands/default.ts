import { Command, command, metadata, Options, option } from 'clime';
import { Fetcher } from '../main/fetcher';

class COptions extends Options {
  @option({
    flag: 'e',
    description: 'affluent email',
    default: 'developertest@affluent.io',
  })
  email: string;

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
  async execute(credentials: COptions) {
    const fetcher = new Fetcher(credentials);
    return fetcher.scrape();
  }
}
