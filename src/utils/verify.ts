import { join } from 'path';
import { existsSync } from 'fs';
import { readJson } from 'fs-extra';
import chalk from 'chalk';

export const verifyPackageJsonExists = (
  projectDirectory: string
): Promise<void> =>
  new Promise((resolve, reject) => {
    const packageJsonPath = join(projectDirectory, 'package.json');

    if (!existsSync(packageJsonPath)) {
      reject(
        `Plutt can not find ${chalk.magenta('package.json')} in ${chalk.magenta(
          projectDirectory
        )}`
      );
    }

    resolve();
  });

export const verifyHostPath = (projectDirectory: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    const packageJsonPath = join(projectDirectory, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    if (!packageJson.hostPath) {
      reject(
        `Plutt can not find a ${chalk.magenta(
          'hostPath'
        )} field in ${chalk.magenta('package.json')}`
      );
    }

    resolve();
  });

export const verifyNameField = (projectDirectory: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    const packageJsonPath = join(projectDirectory, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    if (!packageJson.name) {
      reject(
        `Plutt can not find a ${chalk.magenta('name')} field in ${chalk.magenta(
          'package.json'
        )}`
      );
    }

    resolve();
  });

export const verifyVersionField = (projectDirectory: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    const packageJsonPath = join(projectDirectory, 'package.json');
    const packageJson = await readJson(packageJsonPath);

    if (!packageJson.version) {
      reject(
        `Plutt can not find a ${chalk.magenta(
          'version'
        )} field in ${chalk.magenta('package.json')}`
      );
    }

    resolve();
  });

export const verifySourceDirectory = (
  projectDirectory: string
): Promise<void> =>
  new Promise((resolve, reject) => {
    const sourceDirectory = join(projectDirectory, 'src');
    const entryPath = join(sourceDirectory, 'index.js');

    if (!existsSync(sourceDirectory)) {
      reject(`Can not build plutt. There does not exist a src directory.
        
Looking in ${chalk.magenta(entryPath)}`);
    }

    resolve();
  });

export const verifyIndexFile = (projectDirectory: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const entryPath = join(projectDirectory, 'src', 'index.js');

    if (!existsSync(entryPath)) {
      reject(`Can not build plutt. There does not exist an index file.
        
Looking in ${chalk.magenta(entryPath)}`);
    }
    resolve();
  });
