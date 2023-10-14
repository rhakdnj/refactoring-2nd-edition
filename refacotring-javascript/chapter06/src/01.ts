import {LocalDateTime} from '@js-joda/core';

const printOwing = (invoice: any) => {
    printBanner();
    const outstanding = calculateOutstanding(invoice);
    recordDueDate(invoice);
    printDetails(invoice, outstanding);
};

const printBanner = (): void => {
    console.log('********************');
    console.log('***** 고객채무 *****');
    console.log('********************');
};

const printDetails = (invoice: any, outstanding: number) => {
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

const calculateOutstanding = (invoice: any) => invoice.orders.reduce((outstanding: number, order: any) => outstanding + order.amount, 0);

const recordDueDate = (invoice: any) => {
    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
