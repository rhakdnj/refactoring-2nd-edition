const usd = (number: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(number / 100);

/**
 * no use
 */
const bottomBand = (usage: number) => Math.min(usage, 100);
const middleBand = (usage: number) => (usage > 100 ? Math.min(usage, 200) - 100 : 0);
const topBand = (usage: number) => (usage > 200 ? usage - 200 : 0);


const withinBand = (usage: number, bottom: number, top: number) => usage > bottom ?
    Math.min(usage, top) - bottom : 0;

const baseCharge = (usage: number) => {
    // withinBand 도입: 보호 구문 제거 가능
    if (usage < 0) return usd(0);

    const amount =
        withinBand(usage, 0, 100) * 0.03 +
        withinBand(usage, 100, 200) * 0.05 +
        withinBand(usage, 200, Infinity) * 0.07;

    return usd(amount);
};
