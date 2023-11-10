const disabilityAmount = (employee: any) => {
    if (isNotEligibleForDisability(employee)) return 0;
    // 장애 수당 계산
}

const isNotEligibleForDisability = (employee: any) => {
    return employee.seniority < 2 || employee.monthDisabled > 12 || employee.isPartTime
}
