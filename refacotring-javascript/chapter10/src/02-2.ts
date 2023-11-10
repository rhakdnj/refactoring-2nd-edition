const func = (employee: any) => {
    if (employee.onVacation && employee.seniority > 10) return 1;
    return 0.5;
}
