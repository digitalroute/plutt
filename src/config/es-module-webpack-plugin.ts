import { Plugin, Compiler } from 'webpack';
import { extname } from 'path';

export class ESModuleEmitter implements Plugin {
  options: any;

  constructor(options: any) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('ESModuleEmitter', (compilation) => {
      const mainAsset = Object.entries(compilation.assets).find(
        ([asset_name]) =>
          extname(asset_name) === '.js' && !asset_name.includes('worker')
      ) as [any, any];

      if (!mainAsset) {
        return;
      }

      const [, main] = mainAsset;

      const rawAsset = main._source.children[0];
      main._source.children[0] = rawAsset.replace(
        /module\.exports ?=/,
        'export default '
      );
    });
  }
}
