import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as core from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { checkTypeBySymbol } from './util';

const EIP_SYMBOL = Symbol.for('@ogis-rd/awscdk-nat-lib.Eip');

/**
 * An Elastic IP (EIP) address.
 */
export interface IEip extends core.IResource {
  /**
   * The allocation ID.
   *
   * @attribute
   */
  readonly eipAllocationId: string;

  /**
   * The Elastic IP address.
   *
   * @attribute
   */
  readonly eipPublicIp: string;
}

/**
 * Attributes used to import an EIP.
 */
export interface EipAttributes {
  /**
   * The allocation ID.
   */
  readonly eipAllocationId: string;

  /**
   * The Elastic IP address.
   */
  readonly eipPublicIp?: string;
}

abstract class EipBase extends core.Resource implements IEip {
  public abstract readonly eipAllocationId: string;
  public abstract readonly eipPublicIp: string;
}

/**
 * An Elastic IP (EIP) address.
 *
 * @resource AWS::EC2::EIP
 */
export class Eip extends EipBase {
  /**
   * Import an unowned EIP from attributes.
   */
  public static fromEipAttributes(scope: Construct, id: string, attrs: EipAttributes): IEip {
    class Import extends EipBase {
      public readonly eipAllocationId = attrs.eipAllocationId;
      private readonly _eipPublicIp = attrs.eipPublicIp;

      public get eipPublicIp() {
        if (!this._eipPublicIp) {
          throw new Error('eipPublicIp is not provided for the imported Eip.');
        }
        return this._eipPublicIp;
      };
    }
    return new Import(scope, id);
  }

  /**
   * Import an unowned EIP from allocation ID.
   */
  public static fromAllocationId(scope: Construct, id: string, allocationId: string): IEip {
    class Import extends EipBase {
      public readonly eipAllocationId = allocationId;

      public get eipPublicIp(): string {
        throw new Error('eipPublicIp is not provided for the imported Eip.');
      };
    }
    return new Import(scope, id);
  }

  /**
   * Return true if the object is an EIP.
   */
  public static isEip(x: any): x is Eip {
    return checkTypeBySymbol(x, EIP_SYMBOL);
  }

  public readonly eipAllocationId: string;
  public readonly eipPublicIp: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    Object.defineProperty(this, EIP_SYMBOL, { value: true });

    const eip = new ec2.CfnEIP(this, 'Resource');

    this.eipAllocationId = eip.attrAllocationId;
    this.eipPublicIp = eip.attrPublicIp;
  }
}
