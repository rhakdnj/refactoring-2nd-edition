const tenPercentRaise = (person: any) => {
    person.salary = person.salary.multiply(1.1);
};
const fivePercentRaise = (person: any) => {
    person.salary = person.salary.multiply(1.05);
};

const raise = (person: any, factor: number) => {
    person.salary = person.salary.multiply(1 + factor);
};

