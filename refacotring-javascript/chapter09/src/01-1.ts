const scenario = {
    primaryForce: 100,
    secondaryForce: 10,
    mass: 10,
    delay: 40,
};

const distanceTravelled = (scenario: any, time: number) => {
    let result;
    let acc: number = scenario.primaryForce / scenario.mass; // (a = F / m)
    let primaryTime: number = Math.min(time, scenario.delay);
    result = 0.5 * acc * primaryTime ** 2; // 전파된 거리
    let secondaryTime = time - scenario.delay;

    if (secondaryTime > 0) { // 두 번째 힘을 반영해 다시 계산
        let primaryVelocity = acc * scenario.delay;
        acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;
        result += primaryVelocity * secondaryTime + 0.5 * acc * secondaryTime ** 2;
    }
    return result;
};

console.log(distanceTravelled(scenario, 100));
