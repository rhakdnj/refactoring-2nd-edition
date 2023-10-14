const reportLines = (customer: any) => {
    const lines: any[] = []
    lines.push(['name', customer.name])
    lines.push(['location', customer.location])
    return lines
}

const customerA = { name: 'joy', location: 'seoul' }
const customerB = { name: 'jay', location: 'LA' }
console.log(reportLines(customerA))
console.log(reportLines(customerB))
