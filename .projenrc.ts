import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  name: '@ogis-rd/awscdk-nat-lib',
  description: 'AWS CDK constructs for NAT devices',

  buildWorkflow: false,
  depsUpgradeOptions: {
    workflow: false,
  },
  githubOptions: {
    pullRequestLintOptions: {
      contributorStatement: 'By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license.',
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
  projenVersion: '0.79.27',
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

project.synth();
