import { PerformanceCalculator } from './performance.calculator';

export class TragedyCalculator extends PerformanceCalculator {
  public get amount(): number {
    let result: number = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
