import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import chalk from 'chalk';
import webpack from 'webpack';
import configFactory from '../config/webpack-config';

export default function(
  isChildBundle: boolean,
  entry: string,
  distPath: string,
  name: string
) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(
      configFactory('production', isChildBundle, entry, distPath, name)
    );

    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        // _showErrors and __showWarnings are not used but needed for ts
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
          _showErrors: true,
          _showWarnings: true
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }

      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({
        stats,
        warnings: messages.warnings
      });
    });
  });
}
