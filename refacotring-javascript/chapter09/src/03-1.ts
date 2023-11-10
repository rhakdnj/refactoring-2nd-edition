class ProductionPlan {
    private readonly _adjustments: any = [];

    get production() {
        return this._adjustments.reduce((total: number, adjustment: any) => total + adjustment.amount, 0);
    }

    applyAdjustment(adjustment: any) {
        this._adjustments.push(adjustment);
    }
}

const products = new ProductionPlan();
products.applyAdjustment({name: '사과', amount: 10});
products.applyAdjustment({name: '바나나', amount: 20});

console.log(products.production);
