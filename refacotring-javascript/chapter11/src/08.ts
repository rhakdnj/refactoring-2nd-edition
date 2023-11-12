class Employee {
    #name;
    #typeCode;

    constructor(name: string, typeCode: string) {
        this.#name = name;
        this.#typeCode = typeCode;
    }

    get name() {
        return this.#name;
    }

    get type() {
        return this.#typeCode;
    }

    static get legalTypeCodes() {
        return {
            E: 'Engineer',
            M: 'Manager',
            S: 'Salesperson',
        };
    }
}

const createEmployee = (name: string, typeCode: string) => new Employee(name, typeCode);

// 직원 유형을 팩터리 함수의 이름에 녹이는 방식을 권함
const createEngineer = (name: string) => new Employee(name, 'E');

const client1 = () => {
    const document = {name: 'jaime', empType: 'M', leadEngineer: 'sini'};
    const candidate = createEmployee(document.name, document.empType);
    const leadEngineer = createEngineer(document.leadEngineer);
    return {candidate: candidate.name, leadEngineer: leadEngineer.name};
};

console.log(client1());
