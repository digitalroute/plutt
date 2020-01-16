import * as webpack from 'webpack';
import { join } from 'path';

// TODO: Add package version in output name.

const createCompiler = (
  entryPoint: string,
  distPath: string
): webpack.Compiler => {
  const cwd = process.cwd();

  const webpackConfig = {
    entry: entryPoint, //'.plutt', 'child', '__index.js'),
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
      path: distPath, //'dist'),
      filename: 'app.js'
    }
  };

  return webpack(webpackConfig);
};

export default createCompiler;
