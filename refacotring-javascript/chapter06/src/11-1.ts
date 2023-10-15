import {readJSON} from '../../file.controller';
import * as path from 'path';

const products = readJSON(path.join(__dirname, '11-products.json'));
const shippingMethod: any = {
    discountFee: 0.1,
    feePerCase: 0.03,
    discountThreshold: 0.12,
};

const priceOrder = (product: any, quantity: any, shippingMethod: any) => {
    return applyShipping(calculatePriceData(product, quantity), shippingMethod);
};

const calculatePriceData = (product: any, quantity: any) => {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    return {
        basePrice,
        quantity,
        discount
    };
};

const applyShipping = (priceData: any, shippingMethod: any) => {
    const shippingPerCase = priceData.basePrice > shippingMethod.discountThreshold ? shippingMethod.discountFee : shippingMethod.feePerCase;
    const shippingCost: number = priceData.quantity * shippingPerCase;
    return priceData.basePrice - priceData.discount + shippingCost;
};

products.forEach((product: any) => {
    console.log(priceOrder(product, 10, shippingMethod));
});
