let defaultOwnerData: any = {firstName: '마틴', lastName: '파울러'};

const defaultOwner = () => defaultOwnerData;
const setDefaultOwner = (otherOwnerData: any) => {
    defaultOwnerData = otherOwnerData;
};

it('test', () => {
    const owner1 = defaultOwner();
    expect(owner1.lastName).toBe('파울러');

    const owner2 = defaultOwner();
    owner2.lastName = '파슨스';
    expect(owner1.lastName).toBe('파슨스');
});
