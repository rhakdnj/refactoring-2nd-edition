/**
 * cmd: ts-node chapter06/src/11-2.ts -r chapter06/src/11-products.json
 */
import { readJSON } from '../../file.controller';

console.log(process.argv);

class Order {
    private readonly _product: any;

    constructor(product: any) {
        this._product = product;
    }

    public get product(): any {
        return this._product;
    }
}

const main = () => {
    try {
        const argv: string[] = process.argv;
        if (argv.length < 3) {
            throw new Error('파일명을 입력하세요');
        }
        const filename = argv[argv.length - 1];
        const input = readJSON(filename);
        const orders = input.map((item: any) => new Order(item));

        if (argv.includes('-r')) {
            const readyOrders = orders.filter((o: any) => o.product.status === 'ready');
            console.log('ready', readyOrders.length);
        } else {
            console.log('not ready', orders.length);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
