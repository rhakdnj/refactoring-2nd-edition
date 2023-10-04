export const createPerformanceCalculator = (performance: any, play: any) => {
  switch (play.type) {
    case 'tragedy':
      return new TragedyCalculator(performance, play);
    case 'comedy':
      return new ComedyCalculator(performance, play);
    default:
      return new PerformanceCalculator(performance, play);
  }
};

export class PerformanceCalculator {
  private _performance: any;
  private _play: any;

  constructor(performance: any, play: any) {
    this._performance = performance;
    this._play = play;
  }

  public get performance(): any {
    return this._performance;
  }

  public get play(): any {
    return this._play;
  }

  public get amount(): number {
    throw new Error('서브클래스 전용 메서드입니다.');
  }

  public get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  public get amount(): number {
    let result: number = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}


class ComedyCalculator extends PerformanceCalculator {
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
