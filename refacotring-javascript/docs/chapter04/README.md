# 테스트 구축하기
리팩터링하지 않더라도 이런 테스트를 작성하는 일은 개발 효율을 높여준다.

시간을 테스트 코드 작성에 할애하는데 개발 효율이 높아지는 것에 의아해할 수 있다.

그러면 이 이유를 알아보자.

<br/>

## 4.1 자가 테스트 코드의 가치
테스트 코드는 이런 버그를 찾기 위한 디버깅 시간을 줄여주는데 막대한 영향을 끼친다.

테스트 코드를 작은 단위로 작성하면, 찾아야 하는 코드의 양을 확연히 줄여주는 측면에서 **테스트 코드는 디버깅의 시간을 많이 줄여준다.**

테스트를 작성하다 보면 원하는 기능을 추가하기 위해 무엇이 필요한지 고민하게 된다.

그리고 테스트를 먼저 작성함을 통해 코딩이 완료되는 시점(테스트가 모두 통과되는 시점)을 명확하게 판단할 수 있다. 

켄트 백은 이처럼 테스트부터 작성하는 습관을 통해서 테스트 주도 개발(Test-Driven Development)을 개발했다.

TDD에서는 테스트를 먼저 작성하고 테스트를 통과하기 위해 코드를 작성하고 통과한 다음에 리팩토링을 진행하는 과정으로 이뤄져 있다.

이번 장에서는 테스트 코드를 작성하는 방법을 소개하겠다.

<br/>

## 테스트 할 샘플 코드

우선 테스트 대상이 될 코드를 살펴보자.
```text
지역: Asia

수요: 30, 가격: 20

생산자 수: 3

Byzantium: 비용: 10, 생산량: 9, 수익: 90

Attalia: 비용: 12, 생산량: 10, 수익: 120

Sinope: 비용: 10, 생산량: 6, 수익: 60

부족분: 5, 총수익: 230
```
생산 계획은 각 지역(province)의 수요(demand)와 가격(price)으로 구성된다.

지역에 위치한 생산자들은 각기 제품을 특정 가격으로 특정 수량만큼 생산할 수 있다.

생산자별로 제품을 모두 판매했을 때 얻을 수 있는 수익(full revenue)을 보여준다.

부족분 (shortfall)은 수요에서 총 생산량을 뺀 값이고 여기서는 총수익(profit)도 제공한다.

사용자는 여기서 수요, 가격, 생산량(production), 비용(cost)을 조정해 가며, 그에 따른 생산 부족분과 총수익을 확인할 수 있다.

여기서는 이 소프트웨어의 핵심 비즈니스 로직을 살펴보는데 집중하자.

비즈니스 로직 클래스는 크게 두 가지로 구성된다. 지역(Province)과 생산자(Producer)이다.

<br/>

### doc (Sample Province Data)
```ts
const sampleProvinceData = () => ({
    name: 'Asia',
    producers: [
        {name: 'Byzzantium', cost: 10, production: 9},
        {name: 'Attalia', cost: 12, production: 10},
        {name: 'Sinope', cost: 10, production: 6},
    ],
    demand: 30,
    price: 20,
})
```

<br/>

### Province
```ts
import Producer from './producer';

export default class Province {
    private readonly _name: string;
    private readonly _producers: Producer[];
    private _totalProduction: number;
    private _demand;
    private _price;

    constructor(doc: any) {
        this._name = doc.name;
        this._producers = [];
        this._totalProduction = 0;
        this._demand = doc.demand;
        this._price = doc.price;
        doc.producers.forEach((data: any) => this.addProducer(new Producer(this, data)));
    }

    private addProducer(producer: Producer): void {
        this._producers.push(producer);
        this._totalProduction += producer.production;
    }

    public get name() {
        return this._name;
    }

    public get producers() {
        return this._producers;
    }

    public get totalProduction() {
        return this._totalProduction;
    }

    public set totalProduction(totalProduction: number) {
        this._totalProduction = totalProduction;
    }

    public get demand() {
        return this._demand;
    }

    public set demand(demand: string) {
        this._demand = parseInt(demand);
    }

    public get price() {
        return this._price;
    }

    public set price(price: string) {
        this._price = parseInt(price);
    }

    public get shortfall() {
        return this._demand - this._totalProduction;
    }

    public get profit() {
        return this.demandValue - this.demandCost;
    }

    public get demandValue() {
        return this.satisfiedDemand * this._price;
    }

    public get satisfiedDemand() {
        return Math.min(this._demand, this._totalProduction);
    }

    public get demandCost(): number {
        let remainingDemand = this._demand
        let result = 0;
        this._producers
            .sort((a, b) => a.cost - b.cost)
            .forEach(p => {
                const contribution = Math.min(remainingDemand, p.production);
                remainingDemand -= contribution;
                result += contribution * p.cost;
            })
        return result;
    }
}
```

<br/>

### Producer
```ts
import Province from './province';

export default class Producer {
    private readonly _province: Province;
    private readonly _cost: number;
    private readonly _name: string;
    private _production: number;

    constructor(province: Province, data: any) {
        this._province = province;
        this._cost = data.cost;
        this._name = data.name;
        this._production = data.production ?? 0;
    }

    public get cost(): number {
        return this._cost;
    }

    public get name(): string {
        return this._name;
    }

    public get production(): number {
        return this._production;
    }

    public set production(amountStr: string) {
        const amount = parseInt(amountStr);
        const newProduction = Number.isNaN(amount) ? 0 : amount;
        this._province.totalProduction += newProduction - this._production;
        this._production = newProduction;
    }
}
```

<br/>

## 4.3 첫 번째 테스트
다음은 생산 부족분을 테스트하는 코드다.

```ts
import Province from './province';

describe('Province', () => {
    it('[성공] shortfall should be 5', () => {
        const asia = new Province(sampleProvinceData()); // Fixture
        expect(asia.shortfall).toBe(5); // 검증
    });
});
```

**실패해야 할 상황에서는 반드시 실패하게 만들자.**

**자주 테스트하라. 작성 중인 코드는 최소한 몇 분 간격으로 테스트하고, 적어도 하루에 한 번은 전체 테스트를 돌려보자.**

<br/>

## 4.4 테스트 추가하기
**테스트의 목적은 위험요인을 중심으로 작성해야 한다.**

총수익 계산 로직을 테스트해보겠다.

```ts
import Province from './province';

describe('Province', () => {
    // ...

    it('[성공] profit should be 230', () => {
        const asia = new Province(sampleProvinceData());
        expect(asia.profit).toBe(230);
    });
});
```

지금까지 작성한 두 테스트에는 겹치는 부분이 있다.

`const asia = new Province(sampleProvinceData());`

둘 다 첫 줄에서 똑같은 픽스처를 설정한다. 일반 코드와 마찬가지로 테스트 코드에서도 중복은 의심해봐야 한다.

```ts
import Province from './province';

describe('Province', () => {
    const asia = new Province(sampleProvinceData()); // Don't use it like this.
    
    it('[성공] shortfall should be 5', () => {
        expect(asia.shortfall).toBe(5); // 검증
    });

    it('[성공] profit should be 230', () => {
        expect(asia.profit).toBe(230);
    });
});
```

테스트 관련 버그 중 가장 지저분한 유형인 '테스트끼리 상호작용하게 하는 공유 픽스처'를 생성하는 원인이 된다.

나중에 다른 테스트에서 이 공유 객체의 값을 수정하면 이 픽스처를 사용하는 또 다른 테스트가 실패할 수 있다.

즉, 테스트를 실행하는 순서에 따라 결과가 달라질 수 있다.

그러므로 `@BeforeEach`를 사용하자.

```ts
describe('Province', () => {
    let asia: Province;
    beforeEach(() => {
        asia = new Province(sampleProvinceData());
    })

    it('[성공] shortfall should be 5', () => {
        expect(asia.shortfall).toBe(5);
    });

    it('[성공] profit should be 230', () => {
        expect(asia.profit).toBe(230);
    });
});
```
