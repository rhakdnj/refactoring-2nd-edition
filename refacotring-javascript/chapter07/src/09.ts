const findPerson = (people: string[]) => {
    const candidates: string[] = ['Don', 'John', 'Kent'];
    return people.find(p => candidates.includes(p)) ?? ''
};

console.log(findPerson(['Roy', 'Jay', 'Don', 'Kay', 'John', 'Peter', 'Kent', 'Clark']));
