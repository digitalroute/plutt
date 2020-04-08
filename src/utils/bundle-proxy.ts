import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import mkdirp from 'mkdirp';
import paths from '../config/paths';
import path from 'path';

export default async () => {
  const originalBuffer = await promisify(readFile)(paths.proxyTemplate);

  const appPackageJson = require(paths.appPackageJson);
  const { name, version } = appPackageJson;
  const childFileName = `${name}.v${version}.js`;
  const hostPath = paths.servedPath + childFileName;

  const newFile = originalBuffer
    .toString()
    .replace('process.env.HOST_PATH', `'${hostPath}'`);

  const buildPath = path.resolve(paths.proxyBuild, 'react.js');

  await mkdirp(path.dirname(buildPath));
  await promisify(writeFile)(buildPath, newFile);
};
