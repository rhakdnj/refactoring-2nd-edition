let defaultOwnerData: any = {firstName: '마틴', lastName: '파울러'};

const defaultOwner = () => ({...defaultOwnerData}); // 얉은 복사
const setDefaultOwner = (otherOwnerData: any) => {
    defaultOwnerData = otherOwnerData;
};

it('test', () => {
    const owner1 = defaultOwner();
    expect(owner1.lastName).toBe('파울러');

    const owner2 = defaultOwner();
    owner2.lastName = '파슨스';
    expect(owner1.lastName).toBe('파울러');
});

const defaultPerson = () => new Person(defaultOwnerData);

class Person {
    private readonly _firstName: string;
    private readonly _lastName: string;

    public constructor(data: any) {
        this._firstName = data.firstName;
        this._lastName = data.lastName;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }
}
