import { existsSync, readFile } from 'fs';
import { setFailed } from '@actions/core';

export async function getPackageManifest(path: string): Promise<{ [key: string]: any }> {
  if (!existsSync(path)) {
    setFailed('package.json not found with ' + path);
    return {};
  }

  return new Promise((resolve, reject) => {
    readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject(err);
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        setFailed('format package fail: ' + data);
      }
    });
  });
}
