// import { Command } from '@oclif/command';
// import { join } from 'path';
// import { readJson } from 'fs-extra';
// import {
//   verifyPackageJsonExists,
//   verifyHostPath,
//   verifySourceDirectory,
//   verifyIndexFile,
//   verifyNameField,
//   verifyVersionField
// } from '../utils/verify';
// import bundle from '../utils/bundle';
// import { watch } from 'chokidar';

// const throttler = () => {
//   let nextTask: Function | null;
//   let running = false;

//   return async (callback: Function) => {
//     if (running) {
//       nextTask = callback;
//     } else {
//       running = true;
//       nextTask = callback;

//       while (nextTask) {
//         const runTask = nextTask;
//         nextTask = null;
//         // eslint-disable-next-line no-await-in-loop
//         await runTask();
//       }

//       running = false;
//     }
//   };
// };

// export default class Build extends Command {
//   static description = `
// Build a plutt project

// Make sure that there exists a src/ directory with an index.js`;

//   async run() {
//     // 1. Verify that the correct files and fields exists
//     const projectDirectory = process.cwd();

//     try {
//       await Promise.all([
//         verifyPackageJsonExists(projectDirectory),
//         verifyHostPath(projectDirectory),
//         verifyNameField(projectDirectory),
//         verifyVersionField(projectDirectory),
//         verifySourceDirectory(projectDirectory),
//         verifyIndexFile(projectDirectory)
//       ]);
//     } catch (error) {
//       this.error(error);
//     }

//     // 2. Read package.json
//     const packageJsonPath = join(projectDirectory, 'package.json');
//     const { hostPath, version, name } = await readJson(packageJsonPath);

//     // 3. Start watcher
//     const throttle = throttler();

//     watch(join(projectDirectory, 'src')).on('all', () => {
//       try {
//         throttle(async () => {
//           this.log('Compiling...');

//           await bundle({ projectDirectory, version, name, hostPath });
//           this.log('Finished!');
//         });
//       } catch (error) {
//         this.error(error);
//       }
//     });
//   }
// }
