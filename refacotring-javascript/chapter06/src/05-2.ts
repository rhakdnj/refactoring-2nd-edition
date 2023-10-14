const someCustomers = [
    {
        name: 'joy',
        address: {state: 'MA'},
    },
    {
        name: 'jay',
        address: {state: 'CT'},
    },
    {
        name: 'kay',
        address: {state: 'ME'},
    },
    {
        name: 'lay',
        address: {state: 'NONE'},
    },
    {
        name: 'qay',
        address: {state: 'VT'},
    },
    {
        name: 'way',
        address: {state: 'NH'},
    },
    {
        name: 'tay',
        address: {state: 'RI'},
    },
];

const inNewEngland = (customer: any) => {
    return ['MA', 'CT', 'ME', 'VT', 'NH', 'RI'].includes(customer.address.state);
};

const newEnglanders = someCustomers.filter(c => inNewEngland(c));

console.log(newEnglanders);
