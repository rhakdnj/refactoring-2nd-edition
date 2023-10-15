const someCustomers: any = [
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

function inNewEngland(stateCode: any) {
    return ['MA', 'CT', 'ME', 'VT', 'NH', 'RI'].includes(stateCode);
}

const newEnglanders: any = someCustomers.filter((c: any) => inNewEngland(c.address.state));

console.log(newEnglanders);
