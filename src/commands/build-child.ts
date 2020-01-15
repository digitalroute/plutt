import { Command } from '@oclif/command';
import { existsSync, rmdir } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { remove, copy } from 'fs-extra';

export default class BuildChild extends Command {
  static description = 'describe the command here';

  static examples = [
    `$ plutt hello
hello world from ./src/hello.ts!
`
  ];

  async run() {
    // 1. Check that src and src/index exists
    const projectDir = process.cwd();
    const srcDir = join(projectDir, 'src');
    const srcPath = join(srcDir, 'index.js');

    if (!existsSync(srcDir)) {
      this.error(`Can not build plutt. There does not exist a src directory.
      
      Looking in ${chalk.magenta(srcPath)}`);
    }

    if (!existsSync(srcPath)) {
      this.error(`Can not build plutt. There does not exist an index file.
      
      Looking in ${chalk.magenta(srcPath)}`);
    }

    // 2. Copy files to .plutt/
    const tempDir = join(projectDir, '.plutt');
    await remove(tempDir);
    await copy(srcDir, tempDir);

    // 3. Add __index.js to .plutt/
    const childWrapperPath = join(
      __dirname,
      '..',
      '..',
      'templates',
      'child.js'
    );
    const childWrapperDest = join(tempDir, '__index.js');
    await copy(childWrapperPath, childWrapperDest);

    // 4. Compile with webpack
  }
}
