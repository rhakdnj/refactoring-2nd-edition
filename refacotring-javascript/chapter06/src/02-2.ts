const gatherCustomerData = (out: any[], customer: any) => {
    out.push(['name', customer.name])
    out.push(['location', customer.location])
}
const reportLines = (customer: any) => {
    const lines: any[] = []
    gatherCustomerData(lines, customer)
    return lines
}

const customerA = { name: 'joy', location: 'seoul' }
const customerB = { name: 'jay', location: 'LA' }
console.log(reportLines(customerA))
console.log(reportLines(customerB))
