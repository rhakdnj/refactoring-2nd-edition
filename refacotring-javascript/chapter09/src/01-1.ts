const scenario = {
    primaryForce: 100,
    secondaryForce: 10,
    mass: 10,
    delay: 40,
};

const distanceByAcceleration = (acc: number, time: number) =>  0.5 * acc * time ** 2;

const primary = (primaryForce: any, mass: any, delay: any, time: any) => {
    const primaryAcceleration: number = primaryForce / mass; // (a = F / m)
    const primaryTime: number = Math.min(time, delay);
    return {primaryAcceleration, primaryDistance: distanceByAcceleration(primaryAcceleration, primaryTime)};
};

const distanceTravelled = (scenario: any, time: number) => {
    const {primaryForce, secondaryForce, mass, delay} = scenario;

    let {primaryAcceleration, primaryDistance: primaryResult} = primary(primaryForce, mass, delay, time);
    const secondaryTime = time - delay;

    if (secondaryTime <= 0) return primaryResult;

    // 두 번째 힘을 반영해 다시 계산
    let primaryVelocity = primaryAcceleration * delay;
    const secondaryAcceleration = (primaryForce + secondaryForce) / mass;
    return (
        primaryResult +
        primaryVelocity * secondaryTime +
        distanceByAcceleration(secondaryAcceleration, secondaryTime)
    );
};

console.log(distanceTravelled(scenario, 100));
