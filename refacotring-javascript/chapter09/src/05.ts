class Customer {
    #id;

    constructor(id: string) {
        this.#id = id;
    }

    get id() {
        return this.#id;
    }
}

class Order {
    #number: number;
    #customer: Customer;

    constructor(data: any) {
        this.#number = data.number;
        this.#customer = registerCustomer(data.customer);
    }

    get customer() {
        return findCustomer(this.#customer.id);
    }
}

const _repositoryData = {customers: new Map()};

const registerCustomer = (id: string) => {
    if (!_repositoryData.customers.has(id)) {
        _repositoryData.customers.set(id, new Customer(id));
    }
    return findCustomer(id);
}

const findCustomer = (id: string): Customer => {
    return _repositoryData.customers.get(id);
}

const order: Order = new Order({number: 1, customer: 'id_1'});
console.log(order.customer.id);
