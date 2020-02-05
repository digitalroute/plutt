import { join } from 'path';
import { remove } from 'fs-extra';
import bundleChild from './bundle-child';
import bundleWrapper from './bundle-wrapper';

type buildInformation = {
  projectDirectory: string;
  sourceDirectory: string;
  version: string;
  name: string;
  hostPath: string;
};

export default async ({
  projectDirectory,
  sourceDirectory,
  version,
  name,
  hostPath
}: buildInformation) => {
  // 1. Remove .plutt and build directory
  const pluttDirectory = join(projectDirectory, '.plutt');
  const buildDirectory = join(projectDirectory, 'build');
  await Promise.all([remove(pluttDirectory), remove(buildDirectory)]);

  // 2. Bundle child
  const versionString = 'v' + version;
  const childFileName = await bundleChild(
    projectDirectory,
    sourceDirectory,
    versionString,
    name
  );

  // 3. Compile wrapper
  await bundleWrapper(projectDirectory, hostPath, childFileName);
};
