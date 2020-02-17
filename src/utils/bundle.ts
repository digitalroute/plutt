import { remove } from 'fs-extra';
import bundleChild from './bundle-child';
import bundleWrapper from './bundle-wrapper';
import paths from '../config/paths';

export default async (sourceDirectory: string) => {
  // 1. Remove .plutt and build directory
  await Promise.all([remove(paths.pluttPath), remove(paths.buildPath)]);
  // 2. Bundle child
  await bundleChild(sourceDirectory);
  // 3. Compile wrapper
  await bundleWrapper(sourceDirectory);
};
