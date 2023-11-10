const createResource = () => ({});
const availableResources: any = [];
const allocatedResources: any = [];

const func = () => {
    let result;
    if (availableResources.length === 0) {
        result = createResource();
        allocatedResources.push(result);
    } else {
        result = availableResources.pop();
        allocatedResources.push(result);
    }
    return result;
};
