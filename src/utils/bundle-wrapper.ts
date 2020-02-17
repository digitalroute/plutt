import { remove, copy } from 'fs-extra';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import compiler from './compiler';
import { join } from 'path';
import paths from '../config/paths';
const urlJoin = require('url-join');

export default async () => {
  // 1.Copy wrapper to build directory

  // await remove(buildDestination);
  await copy(paths.wrapperTemplate, paths.wrapperTemplateIntermediate);

  // 3. Update wrapper to import the correct file
  // const wrapperBuffer = await promisify(readFile)(buildDestination);
  // const wrapperRaw = await wrapperBuffer.toString();
  // const remotePath = urlJoin(hostPath, childFileName);

  // const newWrapper = wrapperRaw.replace('<remote.js>', remotePath);

  // await promisify(writeFile)(buildDestination, newWrapper);

  // 5. Compile with rollup
  await compiler(
    false,
    paths.wrapperTemplateIntermediate,
    paths.wrapperBuild,
    'index.js'
  );
};
