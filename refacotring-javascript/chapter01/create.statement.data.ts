const createStatementData = (invoice: any, plays: any) => {
  const playFor = (performance: any) => plays[performance.playID];
  const amountFor = (performance: any) => {
    let thisAmount: number = 0;
    switch (performance.play.type) {
      case 'tragedy': {
        thisAmount = 40000;
        if (performance.audience > 30) {
          thisAmount += 1000 * (performance.audience - 30);
        }
        break;
      }
      case 'comedy': {
        thisAmount = 30000;
        if (performance.audience > 20) {
          thisAmount += 10000 + 500 * (performance.audience - 20);
        }
        thisAmount += 300 * performance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${performance.play.type}`);
    }
    return thisAmount;
  };
  const volumeCreditsFor = (performance: any) => {
    let result: number = 0;
    result += Math.max(performance.audience - 30, 0);
    if (performance.play.type === 'comedy') {
      result += Math.floor(performance.audience / 5);
    }
    return result;
  };
  const totalAmount = (performances: any) => performances.reduce((total: number, p: any) => total + p.amount, 0);
  const totalVolumeCredits = (performances: any) => performances.reduce((total: number, p: any) => total + p.volumeCredits, 0);

  const enrichPerformance = (performance: any) => {
    const result = {...performance};
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
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

