import { remove } from 'fs-extra';
import bundleChild from './bundle-child';
import bundleProxies from './bundle-proxies';
import paths from '../config/paths';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';

export default async (sourceDirectory: string) => {
  // 1. Remove .plutt and build directory
  await Promise.all([remove(paths.pluttPath), remove(paths.buildPath)]);

  // 2. Bundle child
  await bundleChild(sourceDirectory);

  // 3. Compile proxy
  await bundleProxies();

  // 4. Generate type definitions (if typescript should be used)
  const useTypeScript = fs.existsSync(paths.appTsConfig);

  if (useTypeScript) {
    const tscCliPath = path.resolve(paths.node_modules, '.bin', 'tsc');

    const execPromise = promisify(exec);
    await execPromise(`${tscCliPath} --emitDeclarationOnly --declaration`);
  }
};
