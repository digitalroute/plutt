import { join } from 'path';
import { remove, copy } from 'fs-extra';
import compiler from './compiler';

export default async (
  projectDirectory: string,
  version: string,
  name: string
): Promise<string> => {
  // 1. Define paths
  const buildDirectory = join(projectDirectory, '.plutt', 'child');
  const sourceDirectory = join(projectDirectory, 'src');
  const childWrapperOrigin = join(
    __dirname,
    '..',
    '..',
    'templates',
    'child.js'
  );
  const childWrapperDestination = join(buildDirectory, '__index.js');
  const finalDist = join(projectDirectory, 'dist');

  // 2. Copy source files
  await remove(buildDirectory);
  await copy(sourceDirectory, buildDirectory);

  // 3. Copy template
  await copy(childWrapperOrigin, childWrapperDestination);

  // 4. Compile with rollup
  const fileName = `${name}.${version}.js`;
  await compiler(childWrapperDestination, finalDist, fileName);
  return fileName;
};
