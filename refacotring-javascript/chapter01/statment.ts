import createStatementData from './create.statement.data';

export const statement = (invoice: any, plays: any) => {
  return renderPlainText(createStatementData(invoice, plays));
};

export const htmlStatement = (invoice: any, plays: any) => {
  return renderHtml(createStatementData(invoice, plays));
};

const renderPlainText = (data: any) => {
  let result: string = `청구 내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
};

const renderHtml = (data: any) => {
  let result: string = `
<h1>청구 내역 (고객명: ${data.customer})</h1>
<table>
  <tr><th>연극</th><th>좌석수</th><th>금액</th></tr>
`;
  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td><td>${usd(perf.amount)}</td></tr>`;
  }
  result += `</table>
<p>총액: <em>${usd(data.totalAmount)}</em></p>
<p>적립 포인트: <em>${data.totalVolumeCredits}점</em></p>
`;
  return result;
};

const usd = (number: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format(number / 100);

