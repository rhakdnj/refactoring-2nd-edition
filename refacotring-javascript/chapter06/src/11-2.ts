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

class CommandLine {
    private readonly _filename: string;
    private readonly _onlyCountReady: boolean;

    constructor(args: string[]) {
        if (args.length < 3) {
            throw new Error('파일명을 입력하세요');
        }
        this._filename = args[args.length - 1];
        this._onlyCountReady = args.includes('-r');
    }

    get filename(): string {
        return this._filename;
    }

    get onlyCountReady(): boolean {
        return this._onlyCountReady;
    }
}

const run = (args: string[]) => {
    return countOrders(new CommandLine(args));
};

const countOrders = (commandLine: CommandLine) => {
    const input = readJSON(commandLine.filename);
    const orders = input.map((item: any) => new Order(item));

    if (commandLine.onlyCountReady) {
        const readyOrders = orders.filter((o: any) => o.product.status === 'ready');
        return `ready: ${readyOrders.length}`;
    } else {
        return `not ready: ${orders.length}`;
    }
};

const main = () => {
    try {
        console.log(run(process.argv));
    } catch (err) {
        console.error(err);
    }
};

main();
