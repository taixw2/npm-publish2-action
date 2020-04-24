import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { npmPublish } from './npm-publish';
import { githubPublish } from './github-publish';

async function run(): Promise<void> {
  const workspaces = core.getInput('workspaces').split(',');
  try {
    // npm is required
    await exec.exec('npm', ['--version']);
  } catch (error) {
    core.setFailed('npm is not install');
  }

  let manifests;
  try {
    manifests = await Promise.all(workspaces.map(npmPublish));
  } catch (error) {
    core.setFailed('npm publish fail' + error);
  }

  if (!process.env.GITHUB_TOKEN) return;
  try {
    await githubPublish(manifests ?? []);
  } catch (error) {
    core.setFailed('github publish fail' + error);
  }
}

run();
