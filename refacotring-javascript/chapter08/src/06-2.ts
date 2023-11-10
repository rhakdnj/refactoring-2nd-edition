const createResource = () => ({});
const availableResources: any = [];
const allocatedResources: any = [];

const func = () => {
    let result = availableResources.length === 0 ? createResource() : availableResources.pop();
    allocatedResources.push(result);
    return result;
};
