const adjustCapital = (instrument: any) => {
    return (instrument.capital <= 0 || instrument.interestRate <= 0 || instrument.duration <= 0) ? 0
        : (instrument.income / instrument.duration) * instrument.adjustmentFactor;
};
