import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import mkdirp from 'mkdirp';
import paths from '../config/paths';
import path from 'path';

const bundleProxy = async (
  hostPath: string,
  proxyPath: string,
  buildName: string
) => {
  const originalBuffer = await promisify(readFile)(proxyPath);

  const newFile = originalBuffer
    .toString()
    .replace('process.env.HOST_PATH', `'${hostPath}'`);

  const buildPath = path.resolve(paths.proxyBuild, buildName);

  await mkdirp(path.dirname(buildPath));
  await promisify(writeFile)(buildPath, newFile);
};

export default async () => {
  const appPackageJson = require(paths.appPackageJson);
  const { name, version } = appPackageJson;
  const childFileName = `${name}.v${version}.js`;
  const hostPath = paths.servedPath + childFileName;

  await bundleProxy(hostPath, paths.proxyReactTemplate, 'react.js');
  await bundleProxy(hostPath, paths.proxyVueTemplate, 'vue.vue');
};
