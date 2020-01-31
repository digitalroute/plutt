import bundleChild from './bundle-child';
import bundleWrapper from './bundle-wrapper';

type buildInformation = {
  projectDirectory: string;
  version: string;
  name: string;
  hostPath: string;
};

export default async ({
  projectDirectory,
  version,
  name,
  hostPath
}: buildInformation) => {
  const versionString = 'v' + version;

  // 1. Bundle child
  const childFileName = await bundleChild(
    projectDirectory,
    versionString,
    name
  );

  // 2. Compile wrapper
  await bundleWrapper(projectDirectory, hostPath, childFileName);
};
