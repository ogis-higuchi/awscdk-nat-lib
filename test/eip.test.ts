import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as core from 'aws-cdk-lib/core';
import { Eip, EipAttributes } from '../src';

describe('EIP', () => {
  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  test('default', () => {
    const eip = new Eip(stack, 'Eip');

    expect(Eip.isEip(eip)).toBe(true);
    expect(eip.node.defaultChild instanceof ec2.CfnEIP).toBe(true);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::EIP', 1);
    template.resourcePropertiesCountIs('AWS::EC2::EIP', {}, 1);
  });

  test('import from attributes', () => {
    const attributes: EipAttributes = {
      eipAllocationId: 'eipalloc-123456789abcdefgh',
      eipPublicIp: '1.2.3.4',
    };
    const eip = Eip.fromEipAttributes(stack, 'Eip', attributes);

    expect(Eip.isEip(eip)).toBe(false);
    expect(eip.eipAllocationId).toBe(attributes.eipAllocationId);
    expect(eip.eipPublicIp).toBe(attributes.eipPublicIp);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::EIP', 0);
  });

  test('import with allocation ID', () => {
    const allocationId = 'eipalloc-123456789abcdefgh';

    const eip = Eip.fromAllocationId(stack, 'Eip', allocationId);

    expect(Eip.isEip(eip)).toBe(false);
    expect(eip.eipAllocationId).toBe(allocationId);
    expect(() => {
      eip.eipPublicIp;
    }).toThrow('eipPublicIp is not provided for the imported Eip.');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::EIP', 0);
  });
});
