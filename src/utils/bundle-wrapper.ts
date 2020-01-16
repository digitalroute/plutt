import { remove, copy } from 'fs-extra';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import Command from '@oclif/command';
import compiler from './compiler';
import { join } from 'path';
const urlJoin = require('url-join');

export default async (
  projectDirectory: string,
  hostPath: string,
  childFileName: string,
  command: Command
) => {
  // 1. Define paths
  const buildDestination = join(projectDirectory, '.plutt', 'wrapper.js');
  const wrapperOrigin = join(__dirname, '..', '..', 'templates', 'wrapper.js');
  const finalDist = join(projectDirectory, 'dist');

  // 2.Copy wrapper to build directory
  await remove(buildDestination);
  await copy(wrapperOrigin, buildDestination);

  // 3. Update wrapper to import the correct file
  const wrapperBuffer = await promisify(readFile)(buildDestination);
  const wrapperRaw = await wrapperBuffer.toString();

  const newWrapper = wrapperRaw.replace(
    '<remote.js>',
    urlJoin(hostPath, childFileName)
  );

  await promisify(writeFile)(buildDestination, newWrapper);

  // 5. Compile with webpack
  try {
    await compiler(
      buildDestination,
      finalDist,
      'index.js',
      'development',
      command
    );
  } catch (error) {
    throw error;
  }
};
