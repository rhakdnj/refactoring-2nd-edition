import {readJSON} from '../../file.controller';
import * as path from 'path';

const products = readJSON(path.join(__dirname, '11-products.json'));
const shippingMethod: any = {
    discountFee: 0.1,
    feePerCase: 0.03,
    discountThreshold: 0.12,
};

const priceOrder = (product: any, quantity: any, shippingMethod: any) => {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    const shippingPerCase =
        basePrice > shippingMethod.discountThreshold ? shippingMethod.discountFee : shippingMethod.feePerCase;
    const shippingCost = quantity * shippingPerCase;
    const price = basePrice - discount + shippingCost;
    return price;
};

products.forEach((product: any) => {
    console.log(priceOrder(product, 10, shippingMethod));
});
