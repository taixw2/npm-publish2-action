import { compare } from 'semver';
import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as cp from 'child_process';

export async function githubPublish(manifests: object[]): Promise<void> {
  const latestVersion = manifests.map((v: any) => v.version).sort(compare)[0];

  const username = cp.execSync("git log -1 --pretty=format:'%an'").toString('utf8');
  const useremail = cp.execSync("git log -1 --pretty=format:'%ae'").toString('utf8');
  await exec.exec('git', ['config', 'user.name', username], { cwd: process.cwd() });
  await exec.exec('git', ['config', 'user.email', useremail], { cwd: process.cwd() });

  try {
    await exec.exec('git', ['add', '-am', 'release: v' + latestVersion], { cwd: process.cwd() });
    await exec.exec('git', ['tag', 'v' + latestVersion], { cwd: process.cwd() });
    await exec.exec('git', ['branch', '-b', 'add-release-v' + latestVersion], { cwd: process.cwd() });
    await exec.exec('git', ['push', 'origin', 'add-release-v' + latestVersion, '--tags'], { cwd: process.cwd() });
  } catch (error) {
    core.setFailed(error);
  }
}
