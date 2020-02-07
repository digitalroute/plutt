import { Command, flags } from '@oclif/command';
import { join } from 'path';
import { readJson } from 'fs-extra';
import { cosmiconfig } from 'cosmiconfig';
import chalk from 'chalk';

import {
  verifyPackageJsonExists,
  verifySourceDirectory,
  verifyIndexFile
} from '../utils/verify';
import bundle from '../utils/bundle';

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
Build a plutt project

Make sure that there exists a src/ directory with an index.js`;

  static flags = {
    sourceDirectory: flags.string({
      char: 's',
      description: 'The source directory for the plutt project.',
      default: 'src'
    })
  };

  async run() {
    // 1. Read flags and config
    const { flags } = this.parse(Build);
    const sourceDirectory = flags.sourceDirectory;
    const projectDirectory = process.cwd();

    const explorer = await cosmiconfig('plutt');
    const cosmicConfigResult = await explorer
      .search(projectDirectory)
      .catch(this.error);

    if (!cosmicConfigResult || cosmicConfigResult.isEmpty)
      this.error(
        `Plutt could not find any config in ${chalk.magenta(
          'package.json'
        )} or config file.`
      );

    const { config } = cosmicConfigResult;

    // 2. Verify that the correct files exists
    try {
      await Promise.all([
        verifyPackageJsonExists(projectDirectory),
        verifySourceDirectory(projectDirectory, sourceDirectory),
        verifyIndexFile(projectDirectory, sourceDirectory)
      ]);
    } catch (error) {
      this.error(error);
    }

    // 3. Verify that the correct fields exists
    const packageJsonPath = join(projectDirectory, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    const { hostPath } = config;
    if (!hostPath) {
      this.error(
        `Could not find any configuration for ${chalk.magenta('hostPath')}`
      );
    }

    const name = chooseDefault(config, packageJson, 'name');
    if (!name) {
      this.error(
        `Could not find any configuration for ${chalk.magenta('name')}`
      );
    }

    const version = chooseDefault(config, packageJson, 'version');
    if (!version) {
      this.error(
        `Could not find any configuration for ${chalk.magenta('version')}`
      );
    }

    // 4. Bundle child and wrapper
    try {
      bundle({
        projectDirectory,
        sourceDirectory,
        version,
        name,
        hostPath,
        logger: this
      });
    } catch (error) {
      this.error(error);
    }
  }
}
