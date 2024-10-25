# awscdk-nat-lib

AWS CDK constructs for NAT devices.

* image (T.B.D.)

* Description
  * NOW: Public NATGW, RouteTable, ...
  * Future: Private NATGW, NAT instance, ...

## Background

* developed privately for years
* open sourced 2023

## Usage

```typescript
const natgw = new PublicNatGateway(this, 'PublicNatGateway', { publicSubnet })
```

```typescript
const publicSubnet = PublicSubnet.fromSubnetId(this, 'PublicSubnet', 'subnet-123456789abcdefgh')
const privateSubnet = PrivateSubnet.fromPrivateSubnetAttributes(stack, 'PrivateSubnet', {
  subnetId: 'private-subnet-1',
  routeTableId: 'rtb-private-subnet-1',
}),

const natGateway = new DefaultPublicNatGateway(stack, 'DefaultPublicNatGateway', {
  publicSubnet,
  [ privateSubnet ],
});
```

* ec2.Vpc example

## API

See the [API Reference](API.md).

## Installation

* Auth for GitHub packages

```sh
npm install @ogis-rd/awscdk-nat-lib
```

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md).

## License

This project is licensed under the [Apache-2.0](LICENSE) license.
