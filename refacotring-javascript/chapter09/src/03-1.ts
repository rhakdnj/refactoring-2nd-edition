class ProductionPlan {
    private _production = 0;
    private readonly _adjustments: any = [];

    get production() {
        return this._production;
    }

    applyAdjustment(adjustment: any) {
        this._adjustments.push(adjustment);
        this._production += adjustment.amount;
    }
}

const products = new ProductionPlan();
products.applyAdjustment({name: '사과', amount: 10});
products.applyAdjustment({name: '바나나', amount: 20});

console.log(products.production);
