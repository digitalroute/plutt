import { rollup } from 'rollup';
import { join } from 'path';
// @ts-ignore
import * as babel from 'rollup-plugin-babel';
import * as commonjs from '@rollup/plugin-commonjs';
import * as resolve from '@rollup/plugin-node-resolve';
import * as replace from '@rollup/plugin-replace';

const NODE_ENV = process.env.NODE_ENV || 'development';

export default async (
  entryPoint: string,
  distPath: string,
  filename: string,
  external: string[] = []
) => {
  const bundle = await rollup({
    input: entryPoint,
    external: ['react', 'react-dom', ...external],
    plugins: [
      // @ts-ignore
      replace({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties']
      }),
      // @ts-ignore
      resolve(),
      // @ts-ignore
      commonjs()
    ]
  });

  await bundle.write({
    file: join(distPath, filename),
    format: 'esm'
  });
};
