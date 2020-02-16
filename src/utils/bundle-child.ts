import { copy } from 'fs-extra';
import compiler from './compiler';
import paths from '../config/paths';

export default async (): Promise<string> => {
  // 1. Copy template
  await copy(paths.childTemplate, paths.childTemplateIntermediate);

  // 2. Get filename
  const appPackageJson = require(paths.appPackageJson);
  const { name, version } = appPackageJson;
  const fileName = `${name}.${version}.js`;

  // 3. Compile with webpack
  await compiler(paths.childTemplateIntermediate, paths.childBuild, fileName);

  return fileName;
};
