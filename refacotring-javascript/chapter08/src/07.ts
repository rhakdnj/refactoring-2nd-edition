const peoples = [
    {age: 30, salary: 4000},
    {age: 40, salary: 7000},
    {age: 24, salary: 2800},
    {age: 37, salary: 4600},
    {age: 27, salary: 3200},
];

const getInfos = (peoples: any) => `최연소: ${youngestAge(peoples)}, 총급여: ${totalSalary(peoples)}`;

const youngestAge = (peoples: any) => {
    return Math.min(...peoples.map((p: any) => p.age));
};
const totalSalary = (peoples: any) => {
    return peoples.reduce((total: number, p: any) => total + p.salary, 0);
};

console.log(getInfos(peoples));
