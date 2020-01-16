import * as webpack from 'webpack';
import { join } from 'path';
import { Command } from '@oclif/command';

// TODO: Add package version in output name.

export const createCompiler = (
  entryPoint: string,
  distPath: string,
  filename: string
): webpack.Compiler => {
  const cwd = process.cwd();

  const webpackConfig = {
    mode: 'development',
    entry: entryPoint,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    output: {
      path: distPath,
      filename
    }
  };

  return webpack(webpackConfig);
};

export default (
  entryPoint: string,
  distPath: string,
  filename: string,
  command: Command
): Promise<void> =>
  new Promise((resolve, reject) => {
    createCompiler(entryPoint, distPath, filename).run((error, stats) => {
      if (error) {
        reject(error.stack || error);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        reject(info.errors[0]);
      }

      if (stats.hasWarnings()) {
        info.warnings.forEach(warning => command.warn(warning));
      }

      stats.compilation.errors.forEach(command.log);

      resolve();
    });
  });
