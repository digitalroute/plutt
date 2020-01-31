import { Command } from '@oclif/command';
import { join } from 'path';
import { readJson } from 'fs-extra';
import {
  verifyPackageJsonExists,
  verifyHostPath,
  verifySourceDirectory,
  verifyIndexFile,
  verifyNameField,
  verifyVersionField
} from '../utils/verify';
import bundle from '../utils/bundle';

export default class Build extends Command {
  static description = `
Build a plutt project

Make sure that there exists a src/ directory with an index.js`;

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

    // 3. Bundle child and wrapper
    try {
      bundle({ projectDirectory, version, name, hostPath });
    } catch (error) {
      this.error(error);
    }
  }
}
