import { join } from 'path';
import { copy } from 'fs-extra';
import compiler from './compiler';

export default async (
  projectDirectory: string,
  sourceDirectory: string,
  version: string,
  name: string
): Promise<string> => {
  // 1. Define paths
  const buildDirectory = join(projectDirectory, '.plutt', 'child');
  const absoluteSourceDirectory = join(projectDirectory, sourceDirectory);
  const childWrapperOrigin = join(
    __dirname,
    '..',
    '..',
    'templates',
    'child.js'
  );
  const childWrapperDestination = join(buildDirectory, '__index.jsx');
  const finalDist = join(projectDirectory, 'build');

  // 2. Copy source files
  await copy(absoluteSourceDirectory, buildDirectory);

  // 3. Copy template
  await copy(childWrapperOrigin, childWrapperDestination);

  // 4. Compile with rollup
  const fileName = `${name}.${version}.js`;
  await compiler(childWrapperDestination, finalDist, fileName);
  return fileName;
};
