const peoples = [
    {age: 30, salary: 4000},
    {age: 40, salary: 7000},
    {age: 24, salary: 2800},
    {age: 37, salary: 4600},
    {age: 27, salary: 3200},
];

const getInfos = (peoples: any) => {
    let youngest = peoples[0] ? peoples[0].age : Infinity;
    let totalSalary = 0;
    for (const people of peoples) {
        if (people.age < youngest) youngest = people.age;
        totalSalary += people.salary;
    }
    return `최연소: ${youngest}, 총급여: ${totalSalary}`;
};
console.log(getInfos(peoples));
