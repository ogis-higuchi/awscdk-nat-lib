import { awscdk, javascript } from 'projen';

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
  pullRequestTemplateContents: [
    // empty for now
    '',
  ],
  releaseTrigger: {
    isManual: false,
    isContinuous: false,
  },
  npmRegistryUrl: 'https://npm.pkg.github.com',

  // CVE-2023-35165 has been fixed in the version
  cdkVersion: '2.80.0',
  jsiiVersion: '~5.4',
  projenVersion: '0.87.4',
  // Aligned with jsii
  typescriptVersion: '~5.4',

  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,

  repositoryUrl: 'https://github.com/ogis-rd/awscdk-nat-lib.git',
  defaultReleaseBranch: 'main',

  author: 'OGIS-RI Co.,Ltd.',
  authorAddress: 'https://www.ogis-ri.co.jp',
  authorOrganization: true,
});

project.synth();
