import {LocalDateTime} from '@js-joda/core';

const printOwing = (invoice: any) => {
    let outstanding = 0;

    console.log('*******************');
    console.log('***** 고객채무 *****');
    console.log('*******************');

    for (const order of invoice.orders) {
        outstanding += order.amount;
    }

    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);

    // 세부 사항 출력
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
