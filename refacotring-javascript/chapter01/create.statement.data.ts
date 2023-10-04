import { createPerformanceCalculator, PerformanceCalculator } from './calculator/calculator.factory';

const createStatementData = (invoice: any, plays: any) => {
  const playFor = (performance: any) => plays[performance.playID];
  const totalAmount = (performances: any) => performances.reduce((total: number, p: any) => total + p.amount, 0);
  const totalVolumeCredits = (performances: any) => performances.reduce((total: number, p: any) => total + p.volumeCredits, 0);

  const enrichPerformance = (performance: any) => {
    const calculator: PerformanceCalculator = createPerformanceCalculator(performance, playFor(performance));
    const result = {...performance};
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  };
  const enrichPerformances = invoice.performances.map(enrichPerformance);
  return {
    customer: invoice.customer,
    performances: enrichPerformances,
    totalAmount: totalAmount(enrichPerformances),
    totalVolumeCredits: totalVolumeCredits(enrichPerformances)
  };
};

export default createStatementData;

