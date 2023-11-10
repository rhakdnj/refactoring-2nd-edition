class Account {
    daysOverdrawn: number; // 연체일
    accountType: AccountType;

    constructor(daysOverdrawn: number, type: { isPremium: boolean }) {
        this.daysOverdrawn = daysOverdrawn;
        this.accountType = new AccountType(type.isPremium);
    }

    get bankCharge(): number { // 은행 이자 계산
        let result = 4.5;
        if (this.daysOverdrawn > 0) {
            result += this.overdraftCharge;
        }
        return result;
    }

    get overdraftCharge(): number { // 초과 인출 이자 계산
        return this.accountType.overdraftCharge(this.daysOverdrawn);
    }
}

class AccountType {
    private readonly _isPremium: boolean;

    constructor(isPremium: boolean) {
        this._isPremium = isPremium;
    }

    public overdraftCharge(daysOverdrawn: number): number {
        if (this._isPremium) {
            const baseCharge = 10;
            if (daysOverdrawn <= 7) {
                return baseCharge;
            }
            return baseCharge + (daysOverdrawn - 7) * 0.85;
        }
        return daysOverdrawn * 1.75;
    }
}

const loan = new Account(10, {isPremium: true});
const repo = new Account(10, {isPremium: false});

console.log({name: 'loan', charge: loan.bankCharge, overdraftCharge: loan.overdraftCharge});
console.log({name: 'repo', charge: repo.bankCharge, overdraftCharge: repo.overdraftCharge});
