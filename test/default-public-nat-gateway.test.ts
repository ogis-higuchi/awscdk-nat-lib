import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as core from 'aws-cdk-lib/core';
import { DefaultPublicNatGateway, Eip } from '../src';

describe('DefaultPublicNatGateway', () => {
  let stack: core.Stack;
  let publicSubnet: ec2.IPublicSubnet;

  beforeEach(() => {
    stack = new core.Stack();
    publicSubnet = ec2.PublicSubnet.fromSubnetId(stack, 'PublicSubnet', 'subnet-123456789abcdefgh');
  });

  test.each([1, 2])('default with %d private subnets', (count) => {
    const privateSubnets = createPrivateSubnets(count);
    const natGateway = new DefaultPublicNatGateway(stack, 'DefaultPublicNatGateway', {
      publicSubnet,
      privateSubnets,
    });

    expect(DefaultPublicNatGateway.isDefaultPublicNatGateway(natGateway)).toBe(true);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 1);
    template.resourcePropertiesCountIs('AWS::EC2::NatGateway', {
      ConnectivityType: 'public',
      SubnetId: publicSubnet.subnetId,
      AllocationId: {
        'Fn::GetAtt': ['DefaultPublicNatGatewayEipD53FAC11', 'AllocationId'],
      },
    }, 1);

    template.resourceCountIs('AWS::EC2::EIP', 1);
    template.resourcePropertiesCountIs('AWS::EC2::EIP', {}, 1);

    template.resourceCountIs('AWS::EC2::Route', count);
    for (const privateSubnet of privateSubnets) {
      template.resourcePropertiesCountIs('AWS::EC2::Route', {
        RouteTableId: privateSubnet.routeTable.routeTableId,
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: {
          'Fn::GetAtt': ['DefaultPublicNatGateway46EB324C', 'NatGatewayId'],
        },
      }, 1);
    };
  });

  test('create with existing EIP', () => {
    const eip = Eip.fromEipAttributes(stack, 'Eip', {
      eipAllocationId: 'eipalloc-123456789abcdefgh',
      eipPublicIp: '1.2.3.4',
    });

    new DefaultPublicNatGateway(stack, 'DefaultPublicNatGateway', {
      publicSubnet,
      privateSubnets: createPrivateSubnets(1),
      eip,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 1);
    template.resourcePropertiesCountIs('AWS::EC2::NatGateway', {
      AllocationId: eip.eipAllocationId,
    }, 1);

    template.resourceCountIs('AWS::EC2::EIP', 0);
  });

  function createPrivateSubnets(count: number): ec2.IPrivateSubnet[] {
    return Array.from({ length: count }, (_, i) =>
      ec2.PrivateSubnet.fromPrivateSubnetAttributes(stack, `PrivateSubnet${i}`, {
        subnetId: `private-subnet-${i}`,
        routeTableId: `rtb-private-subnet-${i}`,
      }),
    );
  }
});
