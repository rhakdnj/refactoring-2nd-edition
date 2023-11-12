const usd = (number: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(number / 100);

const bottomBand = (usage: number) => Math.min(usage, 100);
const middleBand = (usage: number) => (usage > 100 ? Math.min(usage, 200) - 100 : 0);
const topBand = (usage: number) => (usage > 200 ? usage - 200 : 0);

const baseCharge = (usage: number) => {
    if (usage < 0) return usd(0);
    const amount = bottomBand(usage) * 0.03 + middleBand(usage) * 0.05 + topBand(usage) * 0.07;
    return usd(amount);
};
