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

const localShippingRules = (country: string) => {
    const data = countryData.shippingRules[country];
    if (data) {
        return new ShippingRules(data);
    } else {
        return -23;
    }
};
const calculateShippingCosts = (order: any) => {
    // 관련 없는 코드
    const shippingRules = localShippingRules(order.country);
    if (shippingRules < 0) return shippingRules; // 오류 전파
    // 관련 없는 코드
};
const execute = (order: any) => {
    const status = calculateShippingCosts(order);
    if (status < 0) errorList.push({order, errorCode: status});
};

execute({country: 'US'});
execute({country: 'CA'});
execute({country: 'KO'});

console.log(errorList);
