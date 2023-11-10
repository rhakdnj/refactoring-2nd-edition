const payAmount = (employee: any) => {
    let result;
    if (employee.isSeperated) {
        result = {amount: 0, reasonCode: 'SEP'} // 퇴사
    } else {
        if (employee.isRetired) {
            result = {amount: 0, reasonCode: 'RET'}; // 은퇴
        } else {
            result = {amount: 100, reasonCode: 'WORK'}; // 재직
        }
    }
    return result
}
