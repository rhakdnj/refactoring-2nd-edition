class OrderProcessingError extends Error {
    private readonly _code;

    constructor(errorCode: number) {
        super(`주문 처리 오류 ${errorCode}`);
        this._code = errorCode;
    }

    get name() {
        return 'OrderProcessingError';
    }

    get code() {
        return this._code;
    }
}

class ShippingRules {
    constructor(private readonly data: any) {
        this.data = data;
    }
}

const countryData = {
    shippingRules: {
        US: 10,
        CA: 7,
    },
};
const errorList: any[] = [];

const localShippingRules = (country: 'US' | 'CA') => {
    const data = countryData.shippingRules[country];
    if (data) return new ShippingRules(countryData.shippingRules[country]);
    throw new OrderProcessingError(-23);
};

const calculateShippingCosts = (order: any) => {
    // 관련 없는 코드
    return localShippingRules(order.country);
    // 관련 없는 코드
};
const execute = (order: any) => {
    try {
        calculateShippingCosts(order);
    } catch (error) {
        if (error instanceof OrderProcessingError) {
            errorList.push({order, errorCode: error.code});
        } else {
            throw error;
        }
    }
};

execute({country: 'US'});
execute({country: 'CA'});
execute({country: 'KO'});

console.log(errorList);
