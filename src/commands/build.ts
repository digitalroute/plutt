// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Command, flags } from '@oclif/command';
import { join } from 'path';
import { readJson } from 'fs-extra';
import { cosmiconfig } from 'cosmiconfig';
import chalk from 'chalk';

import bundle from '../utils/bundle';
import { resolveApp } from '../config/paths';

type Config = {
  hostPath: string;
  version: string;
  name: string;
};

function chooseDefault(
  config: Config,
  packageJson: Config,
  field: keyof Config
): string {
  return config[field] || packageJson[field];
}

export default class Build extends Command {
  static description = `
Build a plutt project.

Make sure that there exists a src/ directory with an index.js.`;

  static flags = {
    sourceDirectory: flags.string({
      char: 's',
      description: 'The source directory for the plutt project.',
      default: 'src'
    }),
    verbose: flags.boolean({
      char: 'v',
      description: 'Prints extra information. Useful for debuging.',
      default: false
    })
  };

  async run() {
    // 1. Read flags and config
    const { flags } = this.parse(Build);
    const { sourceDirectory } = flags;
    const projectDirectory = process.cwd();

    const explorer = cosmiconfig('plutt');
    const cosmicConfigResult = await explorer
      .search(projectDirectory)
      .catch(this.error);

    if (!cosmicConfigResult || cosmicConfigResult.isEmpty)
      this.error(
        `Plutt could not find any config in ${chalk.red(
          'package.json'
        )} or config file.`
      );

    const { config } = cosmicConfigResult;

    // 2. Verify that the correct fields exists
    const packageJsonPath = join(projectDirectory, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    const { hostPath } = config;
    if (!hostPath) {
      this.error(
        `Could not find any configuration for ${chalk.red('hostPath')}`
      );
    }

    const name = chooseDefault(config, packageJson, 'name');
    if (!name) {
      this.error(`Could not find any configuration for ${chalk.red('name')}`);
    }

    const version = chooseDefault(config, packageJson, 'version');
    if (!version) {
      this.error(
        `Could not find any configuration for ${chalk.red('version')}`
      );
    }

    // 3. Bundle child and proxy
    this.log('Creating an optimized production build...');
    try {
      await bundle(resolveApp(sourceDirectory));
    } catch (error) {
      this.error(error);
    }

    return this.log(chalk.green('Compiled successfully.'));
  }
}
