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
