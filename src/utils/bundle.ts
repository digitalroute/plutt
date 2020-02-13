import { join } from 'path';
import { remove } from 'fs-extra';
import bundleChild from './bundle-child';
import bundleWrapper from './bundle-wrapper';
import Command from '@oclif/command';

type buildInformation = {
  projectDirectory: string;
  sourceDirectory: string;
  version: string;
  name: string;
  hostPath: string;
  logger: Command;
  verbose: boolean;
};

export default async ({
  projectDirectory,
  sourceDirectory,
  version,
  name,
  hostPath,
  logger,
  verbose
}: buildInformation) => {
  // 1. Remove .plutt and build directory
  const pluttDirectory = join(projectDirectory, '.plutt');
  const buildDirectory = join(projectDirectory, 'build');
  await Promise.all([remove(pluttDirectory), remove(buildDirectory)]);

  // 2. Bundle child
  const versionString = 'v' + version;
  const { fileName: childFileName, useTypescript } = await bundleChild(
    logger,
    verbose,
    projectDirectory,
    sourceDirectory,
    versionString,
    name
  );

  // 3. Compile wrapper
  await bundleWrapper(useTypescript, projectDirectory, hostPath, childFileName);
};
