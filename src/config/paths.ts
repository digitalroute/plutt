import path from 'path';
import fs from 'fs';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

const templateDirectory = path.resolve(__dirname, '..', '..', 'templates');
function resolveTemplate(template: string, extensionOverride?: string) {
  const useTypeScript = fs.existsSync(resolveApp('tsconfig.json'));
  const extension = useTypeScript ? '.tsx' : '.jsx';
  return path.resolve(
    templateDirectory,
    template + (extensionOverride || extension)
  );
}

function resolveTemplateIntermediate(template: string) {
  const useTypeScript = fs.existsSync(resolveApp('tsconfig.json'));
  const extension = useTypeScript ? '.tsx' : '.jsx';
  return path.resolve(appDirectory, '.plutt', template + extension);
}

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath: string, needsSlash: boolean) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
}

const getPublicUrl = (appPackageJson: string) =>
  envPublicUrl || require(appPackageJson).plutt?.hostPath;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson: string) {
  const publicUrl = getPublicUrl(appPackageJson);
  return ensureSlash(publicUrl || '', true);
}

export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
];

const appPackageJson = require(resolveApp('package.json'));
const { name } = appPackageJson;

// config after eject: we're in ./config/
export default {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  pluttPath: resolveApp('.plutt'),
  buildPath: resolveApp('build'),
  childBuild: resolveApp(`build/${name}`),
  proxyBuild: resolveApp('build/proxy'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  childTemplate: resolveTemplate('child'),
  proxyReactTemplate: resolveTemplate('proxy-react', '.jsx'),
  proxyVueTemplate: resolveTemplate('proxy-vue', '.vue'),
  childTemplateIntermediate: resolveTemplateIntermediate('child'),
  proxyTemplateIntermediate: resolveTemplateIntermediate('proxy')
};
