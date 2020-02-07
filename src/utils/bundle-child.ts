import { join } from 'path';
import { copy } from 'fs-extra';
import compiler from './compiler';
import { promisify } from 'util';
import { readdir } from 'fs';
import chalk from 'chalk';
import Command from '@oclif/command';

type ChildInformation = {
  fileName: string;
  useTypescript: boolean;
};

export default async (
  logger: Command,
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
  const finalDist = join(projectDirectory, 'build');

  // // 2. Copy source files
  await copy(absoluteSourceDirectory, buildDirectory);

  // 3. Find child
  const filesInBuild = await promisify(readdir)(buildDirectory);
  const useTypescript = filesInBuild.includes('index.tsx');
  const postfix = useTypescript ? 'tsx' : 'jsx';

  if (useTypescript) {
    logger.log(`${chalk.magenta('index.tsx')} was found => using typescript`);
  } else {
    logger.log(
      `${chalk.magenta('index.tsx')} was not found => using flow / javascript`
    );
  }

  const childWrapperDestination = join(buildDirectory, `__index.${postfix}`);

  // 4. Copy template
  await copy(childWrapperOrigin, childWrapperDestination);

  // // 5. Compile with rollup
  const fileName = `${name}.${version}.js`;
  await compiler(
    useTypescript,
    true,
    childWrapperDestination,
    finalDist,
    fileName
  );
  return { fileName, useTypescript };
};
