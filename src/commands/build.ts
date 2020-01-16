import { Command } from '@oclif/command';
import { promisify } from 'util';
import { existsSync, readFile, writeFile } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { remove, copy, readJson } from 'fs-extra';
import compiler from '../utils/compiler';
import {
  verifyPackageJsonExists,
  verifyHostPath,
  verifySourceDirectory,
  verifyIndexFile,
  verifyNameField,
  verifyVersionField
} from '../utils/verify';
import bundleChild from '../utils/bundle-child';
import bundleWrapper from '../utils/bundle-wrapper';

export default class Build extends Command {
  async run() {
    // 1. Verify that the correct files and fields exists
    const projectDirectory = process.cwd();

    try {
      await Promise.all([
        verifyPackageJsonExists(projectDirectory),
        verifyHostPath(projectDirectory),
        verifyNameField(projectDirectory),
        verifyVersionField(projectDirectory),
        verifySourceDirectory(projectDirectory),
        verifyIndexFile(projectDirectory)
      ]);
    } catch (error) {
      this.error(error);
    }

    // 2. Read package.json
    const packageJsonPath = join(projectDirectory, 'package.json');
    const { hostPath, version, name } = await readJson(packageJsonPath);

    // 3. Bundle child
    let childFileName = '';
    try {
      childFileName = await bundleChild(projectDirectory, version, name, this);
    } catch (error) {
      this.error(error);
    }

    // 4. Compile wrapper
    try {
      await bundleWrapper(projectDirectory, hostPath, childFileName, this);
    } catch (error) {
      this.error(error);
    }
  }
}
