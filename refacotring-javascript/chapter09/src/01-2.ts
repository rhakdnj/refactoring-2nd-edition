const discount = (inputValue: number, quantity: number) => {
    let result: number = inputValue;
    if (inputValue > 50) result -= 2;
    if (quantity > 100) result -= 1;
    return result;
};
console.log(discount(40, 90));
console.log(discount(70, 90));
console.log(discount(70, 110));
