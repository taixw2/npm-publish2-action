import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { npmPublish } from './npm-publish';
import { githubPublish } from './github-publish';

async function run(): Promise<void> {
  const workspaces = core.getInput('workspaces').split(',');

  // npm is required
  await exec.exec('npm', ['--version']);

  try {
    const manifests = await Promise.all(workspaces.map(npmPublish));
    if (!process.env.GITHUB_TOKEN) return;
    githubPublish(manifests);
  } catch (error) {
    core.setFailed(error);
  }
}

run();
