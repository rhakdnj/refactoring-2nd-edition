import { PerformanceCalculator } from './performance.calculator';

export class ComedyCalculator extends PerformanceCalculator {
  public get amount(): number {
    let result: number = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  public get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
