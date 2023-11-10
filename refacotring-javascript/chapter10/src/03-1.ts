const payAmount = (employee: any) => {
    if (employee.isSeperated) {
        return {amount: 0, reasonCode: 'SEP'}; // 퇴사
    }
    if (employee.isRetired) {
        return {amount: 0, reasonCode: 'RET'}; // 은퇴
    }

    // 급여 계산 로직...

    return {amount: 100, reasonCode: 'WORK'}; // 재직
};
