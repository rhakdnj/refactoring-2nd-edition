import { Employee, Department } from './03-1';

describe('Employee', () => {
    it('should be an instance of Employee', () => {
        const e: Employee = new Employee('Jay', 'A001', 3000);
        expect(e.name).toBe('Jay');
        expect(e.monthlyCost).toBe(3000);
    });
});
describe('Department', () => {
    it('should be an instance of Department', () => {
        const roy: Employee = new Employee('Roy', 'A001', 3000);
        const jay: Employee = new Employee('Jay', 'B002', 2500);
        const dep: Department = new Department('영업', [roy, jay]);
        expect(dep.name).toEqual('영업');
        expect(dep.staff).toEqual([roy, jay]);
    });
});
