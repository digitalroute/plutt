import { join } from 'path';
import { copy } from 'fs-extra';
import compiler from './compiler';
import { promisify } from 'util';
import { readdir, readFile, writeFile, mkdir } from 'fs';
import chalk from 'chalk';
import Command from '@oclif/command';
import { transformAsync } from '@babel/core';

type ChildInformation = {
  fileName: string;
  useTypescript: boolean;
};
``;
export default async (
  logger: Command,
  verbose: boolean,
  projectDirectory: string,
  sourceDirectory: string,
  version: string,
  name: string
): Promise<ChildInformation> => {
  // 1. Define paths
  const buildDirectory = join(projectDirectory, '.plutt', 'child');
  const absoluteSourceDirectory = join(projectDirectory, sourceDirectory);
  const childWrapperOrigin = join(
    __dirname,
    '..',
    '..',
    'templates',
    'child.jsx'
  );
  const bundleDist = join(projectDirectory, '.plutt');
  const finalDist = join(projectDirectory, 'build');

  // 2. Copy source files
  await copy(absoluteSourceDirectory, buildDirectory);

  // 3. Find child
  const filesInBuild = await promisify(readdir)(buildDirectory);
  const useTypescript = filesInBuild.includes('index.tsx');
  const postfix = useTypescript ? 'tsx' : 'jsx';

  if (verbose) {
    if (useTypescript) {
      logger.log(`${chalk.cyan('index.tsx')} was found => using typescript`);
    } else {
      logger.log(
        `${chalk.cyan('index.tsx')} was not found => using flow / javascript`
      );
    }
  }

  const childWrapperDestination = join(buildDirectory, `__index.${postfix}`);

  // 4. Copy template
  await copy(childWrapperOrigin, childWrapperDestination);

  // 5. Compile with webpack
  await compiler(childWrapperDestination, bundleDist, 'child-bundle.js');

  // 6. Compile with babel
  const fileName = `${name}.${version}.js`;
  // const bundleCommonJS = await promisify(readFile)(
  //   join(bundleDist, 'child-bundle.js')
  // );

  // const babelResult = await transformAsync(bundleCommonJS.toString(), {
  //   plugins: ['transform-commonjs-es2015-modules'],
  //   compact: true
  // });

  // const code = babelResult?.code;
  // if (!code) throw new Error('Error compiling es module from micro app');

  // await promisify(mkdir)(finalDist);
  // await promisify(writeFile)(join(finalDist, fileName), code);

  return { fileName, useTypescript };
};
