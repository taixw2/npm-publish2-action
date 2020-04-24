import readPkgJson from 'read-package-json';

export async function getPackageManifest(path: string): Promise<{ [key: string]: any }> {
  function error(...logs: string[]): void {
    // throw new Error(...logs);
  }
  return new Promise((resolve, reject) => {
    readPkgJson(path, error, true, (err: Error | null, data: { [key: string]: any }) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}
