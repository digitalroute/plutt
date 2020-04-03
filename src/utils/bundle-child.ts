import { copy } from 'fs-extra';
import compiler from './compiler';
import paths from '../config/paths';

export default async (sourceDirectory: string): Promise<void> => {
  // 1. Copy template
  await copy(paths.childTemplate, paths.childTemplateIntermediate);

  // 2. Get filename
  const appPackageJson = require(paths.appPackageJson);
  const { name, version } = appPackageJson;
  const fileName = `${name}.v${version}.js`;

  // // 3. Compile with webpack
  await compiler(
    true,
    paths.childTemplateIntermediate,
    paths.childBuild,
    sourceDirectory,
    fileName
  );
};
