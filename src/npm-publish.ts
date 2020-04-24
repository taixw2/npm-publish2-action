import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as path from 'path';
import * as fs from 'fs';
import * as semver from 'semver';
import { getPackageManifest } from './read-package-json';

export async function npmPublish(workspace: string): Promise<{ [key: string]: any }> {
  const projectPath = path.resolve(process.cwd(), workspace);
  const packageJSONPath = path.resolve(projectPath, 'package.json');
  const packageManifest = await getPackageManifest(packageJSONPath);
  try {
    await exec.exec('npm', ['view', `${packageManifest.name}@${packageManifest.version}`]);
  } catch (error) {
    // 404
    core.info('npm view error' + error.toString());
    const pkgNoFormat = fs.readFileSync(packageJSONPath, 'utf8');
    const newVersion = semver.inc(packageManifest.version, core.getInput('releaseType') as semver.ReleaseType);
    fs.writeFileSync(packageJSONPath, pkgNoFormat.replace(/"version":(\s*)".*?"/, `"version":$1"${newVersion}"`));
  }

  await exec.exec('npm', ['publish', `--registry=${core.getInput('registry')}`, core.getInput('tag:next') && '--tag=next'], {
    cwd: projectPath,
    env: process.env as any
  });

  return getPackageManifest(packageJSONPath);
}
