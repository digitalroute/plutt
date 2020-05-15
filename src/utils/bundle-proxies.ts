import { readFile, writeFile, copyFile } from 'fs';
import { promisify } from 'util';
import mkdirp from 'mkdirp';
import paths from '../config/paths';
import path from 'path';
import { exec } from 'child_process';

const bundleReactProxy = async (hostPath: string) => {
  const originalBuffer = await promisify(readFile)(paths.proxyReactTemplate);

  const newFile = originalBuffer
    .toString()
    .replace('process.env.HOST_PATH', `'${hostPath}'`);

  const buildPath = path.resolve(paths.proxyBuild, 'react.js');

  await mkdirp(path.dirname(buildPath));
  await promisify(writeFile)(buildPath, newFile);
};

const bundleVueProxy = async (hostPath: string) => {
  // Step 1: Generate vue proxy component
  const originalBuffer = await promisify(readFile)(paths.proxyVueTemplate);

  const newFile = originalBuffer
    .toString()
    .replace('process.env.HOST_PATH', `'${hostPath}'`);

  const buildPath = path.resolve(paths.pluttPath, 'VueProxy.vue');

  await mkdirp(path.dirname(buildPath));
  await promisify(writeFile)(buildPath, newFile);

  // Step 2: Compile vue proxy component
  const execPromise = promisify(exec);

  const vueCliPath = path.resolve(
    paths.node_modules,
    '.bin',
    'vue-cli-service'
  );

  await execPromise(
    `${vueCliPath} build --target lib --name vue-proxy --dest ${path.join(
      paths.pluttPath,
      'vue-dist'
    )} ${buildPath}`
  );

  // Step 3: Copy compiled result
  const copy = promisify(copyFile);
  await copy(
    path.resolve(
      process.cwd(),
      paths.pluttPath,
      'vue-dist',
      'vue-proxy.common.js'
    ),
    path.resolve(paths.proxyBuild, 'vue.js')
  );
};

export default async () => {
  const appPackageJson = require(paths.appPackageJson);
  const { name, version } = appPackageJson;
  const childFileName = `${name}.v${version}.js`;
  const hostPath = paths.servedPath + childFileName;

  await bundleReactProxy(hostPath);
  await bundleVueProxy(hostPath);
};
