import Command, { flags } from '@oclif/command';
import { server } from '../utils/plutt-server';

export class Serve extends Command {
  static description = `Serve a plutt app.`;

  static flags = {
    port: flags.string({
      char: 'p',
      description: 'Port used to serve plutt app',
      default: '5000'
    })
  };

  static args = [
    {
      name: 'directory',
      required: false,
      description: 'Directory to serve plutt apps from',
      default: '.'
    }
  ];

  async run() {
    const {
      args: { directory: listenDirectory },
      flags: { port }
    } = this.parse(Serve);

    server(listenDirectory).listen(port);
  }
}
