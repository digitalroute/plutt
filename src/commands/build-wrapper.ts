import { Command } from '@oclif/command';
import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { remove, copy } from 'fs-extra';
import compiler from '../build-compiler';

export default class BuildWrapper extends Command {
  async run() {
    // 1. Check that src and src/index exists
    const projectDirectory = process.cwd();
    const sourceDirectory = join(projectDirectory, 'src');
    const entryPath = join(sourceDirectory, 'index.js');

    if (!existsSync(sourceDirectory)) {
      this.error(`Can not build plutt. There does not exist a src directory.
      
      Looking in ${chalk.magenta(entryPath)}`);
    }

    if (!existsSync(entryPath)) {
      this.error(`Can not build plutt. There does not exist an index file.
      
      Looking in ${chalk.magenta(entryPath)}`);
    }

    // 2. Copy files to .plutt/child
    const buildDirectory = join(projectDirectory, '.plutt', 'child');
    await remove(buildDirectory);
    await copy(sourceDirectory, buildDirectory);

    // 3. Add __index.js to .plutt/child
    const childWrapperPath = join(
      __dirname,
      '..',
      '..',
      'templates',
      'child.js'
    );
    const childWrapperDestination = join(buildDirectory, '__index.js');
    await copy(childWrapperPath, childWrapperDestination);

    // 4. Compile with webpack (to dist/)
    const compiledChildDestination = join(projectDirectory, 'dist', 'child');
    compiler(childWrapperDestination, compiledChildDestination).run(
      (error, stats) => {
        if (error) {
          this.error(error.stack || error);
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          info.errors.forEach(error => this.error(error));
        }

        if (stats.hasWarnings()) {
          info.warnings.forEach(warning => this.warn(warning));
        }

        stats.compilation.errors.forEach(this.log);
      }
    );
  }
}
