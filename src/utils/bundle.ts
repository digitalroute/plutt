import { remove } from 'fs-extra';
import bundleChild from './bundle-child';
import bundleWrapper from './bundle-wrapper';
import paths from '../config/paths';

export default async () => {
  // 1. Remove .plutt and build directory
  await Promise.all([remove(paths.pluttPath), remove(paths.buildPath)]);
  // 2. Bundle child
  await bundleChild();
  // 3. Compile wrapper
  await bundleWrapper();
};
