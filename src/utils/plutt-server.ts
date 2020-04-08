import http from 'http';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import semver from 'semver';

// maps file extention to MIME type
const mimeMap: { [ext: string]: string } = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};

/**
 * Checks if the file is a plutt app or not. If it is a plutt app it will find
 * the file with the largest minor version.
 * @param {string} fullPath The full url path
 */
async function findFile(fullPath: string): Promise<string | null> {
  const partitionedFullPath = fullPath.split(path.sep);

  const [dir, requestedFile] = partitionedFullPath.splice(
    partitionedFullPath.length - 2
  );

  const prefix = dir + '.v';

  if (!requestedFile.startsWith(prefix)) {
    return fullPath;
  }

  const requestedVersion = '^' + requestedFile.replace(prefix, '');

  const filesInDir = await promisify(fs.readdir)(path.dirname(fullPath));

  const versionsInDir = filesInDir
    .filter((file) => file.startsWith(prefix))
    .map((file) => file.replace(prefix, ''))
    .map((file) => path.basename(file, '.js'));

  const bestVersion = semver.maxSatisfying(versionsInDir, requestedVersion);

  return bestVersion === null
    ? null
    : `${path.dirname(fullPath)}/${prefix}${bestVersion}.js`;
}

export const server = (listenDirectory: string) =>
  http.createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');

    if (request.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      response.writeHead(204, {
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
      });
      return response.end();
    }

    const safeSuffix = path
      .normalize(request.url || '')
      .replace(/^(\.\.[/\\])+/, '');

    const fullPath = path.join(path.resolve(listenDirectory), safeSuffix);

    const requestedFile = await findFile(fullPath);

    if (requestedFile === null) {
      response.writeHead(404);
      return response.end('Version does not exist');
    }

    const ext = path.extname(requestedFile);

    fs.readFile(requestedFile, function(error, data) {
      if (error) {
        if (error.code === 'ENOENT') {
          response.statusCode = 404;
          return response.end(`File ${fullPath} not found!`);
        }
        response.statusCode = 500;
        return response.end(`Error getting the file: ${error}.`);
      }
      response.setHeader('Content-type', mimeMap[ext] || 'text/plain');
      return response.end(data);
    });
  });
