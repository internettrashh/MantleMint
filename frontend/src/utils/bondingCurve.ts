// Precision for calculations (1e18)
const PRECISION = BigInt(10) ** BigInt(18);

export class BondingCurveCalculator {
  private slope: bigint;
  private curveType: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid';

  constructor(curveType: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid') {
    this.curveType = curveType;
    this.slope = BigInt(1000000); // Base slope value
  }

  calculatePurchaseReturn(supply: bigint, amount: bigint): bigint {
    const price = this.getCurrentPrice(supply);
    return (price * amount) / PRECISION;
  }

  calculateSaleReturn(supply: bigint, amount: bigint): bigint {
    const price = this.getCurrentPrice(supply);
    return (price * amount) / PRECISION;
  }

  getCurrentPrice(supply: bigint): bigint {
    switch (this.curveType) {
      case 'linear':
        return this.getLinearPrice(supply);
      case 'exponential':
        return this.getExponentialPrice(supply);
      case 'logarithmic':
        return this.getLogarithmicPrice(supply);
      case 'sigmoid':
        return this.getSigmoidPrice(supply);
      default:
        return BigInt(0);
    }
  }

  private getLinearPrice(supply: bigint): bigint {
    return (supply * this.slope) / PRECISION;
  }

  private getExponentialPrice(supply: bigint): bigint {
    return (supply * supply * this.slope) / (PRECISION * PRECISION);
  }

  private getLogarithmicPrice(supply: bigint): bigint {
    if (supply === BigInt(0)) return BigInt(0);
    // Simplified log calculation for bigint
    const log = BigInt(Math.floor(Math.log(Number(supply)) * Number(PRECISION)));
    return (log * this.slope) / PRECISION;
  }

  private getSigmoidPrice(supply: bigint): bigint {
    // Simplified sigmoid: 1 / (1 + e^(-k*(x-x0)))
    const k = BigInt(1000); // Steepness
    const x0 = PRECISION; // Midpoint
    const exp = this.approximateExp((-k * (supply - x0)) / PRECISION);
    return (PRECISION * this.slope) / (PRECISION + exp);
  }

  private approximateExp(x: bigint): bigint {
    // Taylor series approximation of e^x
    let result = PRECISION;
    let term = PRECISION;
    for (let i = 1; i < 10; i++) {
      term = (term * x) / (BigInt(i) * PRECISION);
      result += term;
    }
    return result;
  }

  getPriceImpact(supply: bigint, amount: bigint, isBuy: boolean): bigint {
    const initialPrice = this.getCurrentPrice(supply);
    const finalSupply = isBuy ? supply + amount : supply - amount;
    const finalPrice = this.getCurrentPrice(finalSupply);
    
    return ((finalPrice - initialPrice) * PRECISION) / initialPrice;
  }
}