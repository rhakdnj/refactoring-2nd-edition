import { Enum, EnumType } from 'ts-jenum';

class Account {
    _number;
    _type;

    constructor(number: number, type: AccountType) {
        this._number = number;
        this._type = type;
    }

    get interestRate() {
        return this._type.interestRate;
    }
}

@Enum('_name')
class AccountType extends EnumType<AccountType>() {
    static readonly PLUS = new AccountType('PLUS', 0.1);
    static readonly MINUS = new AccountType('MINUS', 0.39);

    private constructor(
        private readonly _name: string,
        private readonly _interestRate: number
    ) {
        super();
    }

    get interestRate() {
        return this._interestRate;
    }
}

const acc = new Account(100000, AccountType.MINUS);
console.log(acc.interestRate);
