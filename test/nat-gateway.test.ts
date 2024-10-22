import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as core from 'aws-cdk-lib/core';
import { Eip, PublicNatGateway } from '../src';

describe('PublicNatGateway', () => {
  let stack: core.Stack;
  let publicSubnet: ec2.IPublicSubnet;

  beforeEach(() => {
    stack = new core.Stack();
    publicSubnet = ec2.PublicSubnet.fromSubnetId(stack, 'PublicSubnet', 'subnet-123456789abcdefgh');
  });

  test('default', () => {
    const natgw = new PublicNatGateway(stack, 'PublicNatGateway', {
      publicSubnet,
    });

    expect(PublicNatGateway.isPublicNatGateway(natgw)).toBe(true);
    expect(natgw.node.defaultChild instanceof ec2.CfnNatGateway).toBe(true);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 1);
    template.resourcePropertiesCountIs('AWS::EC2::NatGateway', {
      ConnectivityType: 'public',
      SubnetId: publicSubnet.subnetId,
      AllocationId: {
        'Fn::GetAtt': ['PublicNatGatewayEip77798CCA', 'AllocationId'],
      },
    }, 1);

    template.resourceCountIs('AWS::EC2::EIP', 1);
    template.resourcePropertiesCountIs('AWS::EC2::EIP', {}, 1);
  });

  test('create with EIP', () => {
    const eip = new Eip(stack, 'Eip');

    new PublicNatGateway(stack, 'PublicNatGateway', {
      publicSubnet,
      eip,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 1);
    template.resourcePropertiesCountIs('AWS::EC2::NatGateway', {
      AllocationId: {
        'Fn::GetAtt': ['EipE30CBD02', 'AllocationId'],
      },
    }, 1);

    template.resourceCountIs('AWS::EC2::EIP', 1);
    template.resourcePropertiesCountIs('AWS::EC2::EIP', {}, 1);
  });

  test('create with existing EIP', () => {
    const eip = Eip.fromEipAttributes(stack, 'Eip', {
      eipAllocationId: 'eipalloc-123456789abcdefgh',
      eipPublicIp: '1.2.3.4',
    });

    new PublicNatGateway(stack, 'PublicNatGateway', {
      publicSubnet,
      eip,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 1);
    template.resourcePropertiesCountIs('AWS::EC2::NatGateway', {
      AllocationId: eip.eipAllocationId,
    }, 1);

    template.resourceCountIs('AWS::EC2::EIP', 0);
  });

  test('import from NAT gateway ID', () => {
    const natgwId = 'nat-123456789abcdefgh';
    const natgw = PublicNatGateway.fromNatGatewayId(stack, 'PublicNatGateway', natgwId);

    expect(PublicNatGateway.isPublicNatGateway(natgw)).toBe(false);
    expect(natgw.natGatewayId).toBe(natgwId);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 0);
    template.resourceCountIs('AWS::EC2::EIP', 0);
  });
});
