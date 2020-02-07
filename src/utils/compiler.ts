import { rollup } from 'rollup';
import { join } from 'path';
// @ts-ignore
import * as babel from 'rollup-plugin-babel';
import * as commonjs from '@rollup/plugin-commonjs';
import * as resolve from '@rollup/plugin-node-resolve';
import * as replace from '@rollup/plugin-replace';
import * as typescript from 'rollup-plugin-typescript2';

// @ts-ignore
import * as flow from 'rollup-plugin-flow';
import * as json from '@rollup/plugin-json';

const NODE_ENV = process.env.NODE_ENV || 'development';

function insertIf(condition: boolean, ...elements: any[]): any[] {
  return condition ? elements : [];
}

export default async (
  useTypescript: boolean,
  declaration: boolean,
  entryPoint: string,
  distPath: string,
  filename: string,
  external: string[] = []
) => {
  const bundle = await rollup({
    input: entryPoint,
    external,
    plugins: [
      // @ts-ignore
      replace({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
      }),
      ...insertIf(!useTypescript, flow()),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties']
      }),
      ...insertIf(
        useTypescript,
        // @ts-ignore
        typescript({
          tsconfigDefaults: {
            compilerOptions: {
              jsx: 'react',
              allowSyntheticDefaultImports: true,
              declaration: declaration,
              declarationDir: 'build/types',
              lib: ['es2019', 'dom'],
              module: 'ESNext',
              importHelpers: true
            }
          }
        })
      ),
      // @ts-ignore
      resolve({
        extensions: [
          '.js',
          '.jsx',
          '.json',
          ...insertIf(useTypescript, '.ts', '.tsx')
        ]
      }),
      // @ts-ignore
      json(),
      // @ts-ignore
      commonjs()
    ]
  });

  await bundle.write({
    file: join(distPath, filename),
    format: 'esm'
  });
};
