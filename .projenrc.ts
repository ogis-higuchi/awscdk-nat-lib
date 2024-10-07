import { awscdk, javascript } from 'projen';
import { Job } from 'projen/lib/github/workflows-model';

const contributorStatement = 'By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license.';

const project = new awscdk.AwsCdkConstructLibrary({
  name: '@ogis-rd/awscdk-nat-lib',
  description: 'AWS CDK constructs for NAT devices',

  depsUpgradeOptions: {
    signoff: false,
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.NEVER,
    },
  },
  githubOptions: {
    mergify: false,
    pullRequestLintOptions: {
      contributorStatement,
      semanticTitleOptions: {
        types: [
          'chore',
          'docs',
          'feat',
          'fix',
        ],
      },
    },
  },
  releaseTrigger: {
    isManual: false,
    isContinuous: false,
  },
  npmRegistryUrl: 'https://npm.pkg.github.com',

  // CVE-2023-35165 has been fixed in the version
  cdkVersion: '2.80.0',
  jsiiVersion: '~5.3.0',
  projenVersion: '~0.87',
  // Aligned with jsii 5.3.46 (build 7ede562)
  typescriptVersion: '5.3.3',

  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,

  repositoryUrl: 'https://github.com/ogis-rd/awscdk-nat-lib.git',
  defaultReleaseBranch: 'main',

  author: 'OGIS-RI Co.,Ltd.',
  authorAddress: 'https://www.ogis-ri.co.jp',
  authorOrganization: true,
});

// upgrade-main workflow's 'pr' job
const upgradeMainPrJob = project.upgradeWorkflow!.workflows[0].getJob('pr') as Job;
// Add contributor statement.
// This is a workaround for linting the PR created by human action (workflow_dispatch).
// When we enable the workflow to be triggered automatically, not manually, this workaround would be deleted.
upgradeMainPrJob.steps[4].with!.body += `\n${contributorStatement}`;

project.synth();
