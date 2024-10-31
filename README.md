# awscdk-nat-lib

AWS CDK constructs, mainly L2, for NAT devices and related resources.

Here is the list of supported/unsupported resources at this time:

* NAT devices
  - :white_check_mark: Public NAT gateway
  - :white_square_button: Private NAT gateway
  - :white_square_button: NAT instance
* Related resources
  - :white_check_mark: EIP
  - :white_check_mark: Route table

## Background

We, OGIS-RI Research & Development Department, have been developing the package since 2021.

When we started development, the AWS Construct Library's [Vpc construct][aws-cdk-lib/aws-ec2/Vpc] was the main way to define NATs in an AWS CDK app. While it worked for defining both VPC and NATs together, it didn't fulfill our needs. We need more usability and customizability, such as the ability to create NATs for existing VPCs and standardize common NAT configurations. To address this, we developed the package for internal use, and in 2023, we decided to open source part of it.

[Some similar constructs][@aws-cdk/aws-ec2-alpha] are currently being developed in the AWS Construct Library, but they differ from our constructs in several ways. They can be seen as mutually yet another implementation.

[aws-cdk-lib/aws-ec2/Vpc]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html
[@aws-cdk/aws-ec2-alpha]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-ec2-alpha-readme.html

## Usage

### Public NAT gateway

To create a NAT gateway and an EIP:

```typescript
// A NAT gateway is created in the public subnet
declare const publicSubnet: IPublicSubnet;

const natgw = new PublicNatGateway(this, 'PublicNatGateway', { publicSubnet })
```

### Default public NAT gateway

To create a public NAT gateway and a "default" root (destination is 0.0.0.0/0):

```typescript
// A NAT gateway is created in the public subnet
declare const publicSubnet: IPublicSubnet;
// A "default" root is created in the private subnet's route table
declare const privateSubnet: IPrivateSubnet;

const natgw = new DefaultPublicNatGateway(this, 'DefaultPublicNatGateway', {
  publicSubnet,
  [ privateSubnet ],
});
```

## API

See the [API Reference](API.md).

## Installation

Currently, the only supported package is NPM.
It is hosted on GitHub Packages, so authentication is required for installation.
For instructions on how to authenticate to GitHub Packages, please refer to the [GitHub Docs][Working with the npm registry - GitHub Docs] or the sample [.npmrc][ogis-rd/awscdk-nat-gw-switch/.npmrc] file.

Once authenticated, run the following command to install the package:

```sh
npm install @ogis-rd/awscdk-nat-lib
```

[Working with the npm registry - GitHub Docs]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
[ogis-rd/awscdk-nat-gw-switch/.npmrc]: https://github.com/ogis-rd/awscdk-nat-gw-switch/blob/main/.npmrc

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md).

## License

This project is licensed under the [Apache-2.0](LICENSE) license.
