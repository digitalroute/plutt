import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

export const verifyPackageJsonExists = (
  projectDirectory: string
): Promise<void> =>
  new Promise((resolve, reject) => {
    const packageJsonPath = join(projectDirectory, 'package.json');

    if (!existsSync(packageJsonPath)) {
      reject(
        new Error(
          `Plutt can not find ${chalk.magenta(
            'package.json'
          )} in ${chalk.magenta(projectDirectory)}`
        )
      );
    }

    resolve();
  });

export const verifySourceDirectory = (
  projectDirectory: string,
  sourceDirectory: string
): Promise<void> =>
  new Promise((resolve, reject) => {
    const absoluteSourceDirectory = join(projectDirectory, sourceDirectory);

    if (!existsSync(absoluteSourceDirectory)) {
      reject(
        new Error(`Can not build plutt. There does not exist a src directory.
        
Looking in ${chalk.magenta(absoluteSourceDirectory)}`)
      );
    }

    resolve();
  });

export const verifyIndexFile = (
  projectDirectory: string,
  sourceDirectory: string
): Promise<void> =>
  new Promise((resolve, reject) => {
    const entryPathJs = join(projectDirectory, sourceDirectory, 'index.jsx');
    const entryPathTs = join(projectDirectory, sourceDirectory, 'index.tsx');

    if (!existsSync(entryPathJs) && !existsSync(entryPathTs)) {
      reject(
        new Error(`Can not build plutt. There does not exist an index file.
        
Looking in ${chalk.magenta(entryPathJs)} and ${chalk.magenta(entryPathTs)}`)
      );
    }
    resolve();
  });
