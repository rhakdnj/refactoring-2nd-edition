# 기본적인 리팩터링

내가 가장 많이 사용하는 리팩터링 기법은 **함수 추출하기**(6.1절)과 **변수 추출하기**(6.3절)이다.

리팩터링은 본래 코드를 변경하는 작업인 만큼, 이 두 리팩터링을 반대로 진행하는 **함수 인라인하기**(6.2절)과 **변수 인라인하기**(6.4절) 도 자주 사용한다.

추출한다는 건 결국 이름짓기이다. 코드 이해도가 높아지다 보면 이름을 바꿔야 할 때가 많다.

**함수 선언 바꾸기**(6.5절)는 함수의 이름을 변경할 때, 함수의 인수를 추가하거나 제거할 때 많이 쓰인다.

바꿀 대상이 변수라면 **변수 이름 바꾸기**(6.7절)를 사용하는데, 이는 **변수 캡슐화하기**(6.8절)과 관련이 깊다.

자주 함께 뭉쳐 다니는 인수들은 **매개변수 객체 만들기**(6.8절)를 적용해서 객체 하나로 묶는다.

함수를 그룹으로 묶을 때는 **여러 함수를 클래스로 묶기**(6.9절)를 이용한다.

이와 더불어 이 함수들이 사용하는 데이터도 클래스로 함께 묶는다.

또 다른 함수를 묶는 방법으로는 **여러 함수를 변환 함수로 묶기**(6.10 절) 도 있는데, 이는 읽기 전용 데이터를 다룰 때 특히 좋다.

한데 묶은 모듈들의 처리 과정을 명확한 단계로 구분 짓는 **단계 쪼개기**(6.11절) 를 적용한다.

1. TDD 방식으로 기능을 구현하자.
2. 함수의 파라미터를 신경써서, 공통된 부분은 하나의 클래스 묶자. (함수들이 사용하는 데이터도 클래스로 함께 묶는다.)

<br/>

## 6.1 함수 추출하기

### Before

```ts
import { LocalDateTime } from '@js-joda/core';

const printOwing = (invoice: any) => {
    let outstanding = 0;

    console.log('*******************');
    console.log('***** 고객채무 *****');
    console.log('*******************');

    for (const order of invoice.orders) {
        outstanding += order.amount;
    }

    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);

    // 세부 사항 출력
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
```

### After

```ts
import { LocalDateTime } from '@js-joda/core';

const printOwing = (invoice: any) => {
    printBanner();
    const outstanding = calculateOutstanding(invoice);
    recordDueDate(invoice);
    printDetails(invoice, outstanding);
};

const printBanner = (): void => {
    console.log('********************');
    console.log('***** 고객채무 *****');
    console.log('********************');
};

const printDetails = (invoice: any, outstanding: number) => {
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

const calculateOutstanding = (invoice: any) => invoice.orders.reduce((outstanding: number, order: any) => outstanding + order.amount, 0);

const recordDueDate = (invoice: any) => {
    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
```

<br/>

### 배경

함수 추출하기는 내가 가장 많이 사용하는 리팩터링 중 하나다.

함수 추출하기는 코드 조각을 찾아 무슨 일을 하는지 파악한 다음 독립된 함수로 추출하고 목적에 맞는 이름을 붙이는 것이다.

코드를 언제 독립된 함수로 묶어야 할지에 관한 의견은 수없이 많다.

- 길이를 기준으로, 함수 하나가 한 화면을 넘어가면 안 되는 규칙
- 두 번 이상 사용될 코드는 함수를 만드는 규칙 (중복을 줄이는)
- 목적과 구현을 분리
- ...

그중에서 '**목적과 구현을 분리**'하는 방식이 가장 합리적인 기준으로 보인다.

함수 추출하기는 늘 이름 짓기가 동반되므로 이름을 잘 지어야만 이 리팩터링의 효과가 발휘된다.

<br/>

### 절차

**IDE를 사용하자.**

이름을 지을 땐 함수가 **무엇**을 하는지가 드러나야 한다.

함수 추출한 땐 변수 선언물을 변수가 사용되는 코드 근처로 슬라이드 하는 **문장 슬라이스**(8.6절)도 필요할 때가 있다.

추출 함수에서 수정되는 부분이 caller 함수에서 유지가 되는지 항상 체크하자.

추출 함수에 전달되는 파라미터들을 객체로 합치거나 객체를 통째로 넘기는 방법이 있다.

값을 반환할 변수가 여러 가지 일 수도 있는데 이 경우에 처리하는 방법은 다음과 같다.

주로 재구성하는 방향으로 처리한다.

개인적으로 함수가 값 하나만 반환하는 방식을 선호하기 때문에 각각을 반환하는 함수 여러 개로 만든다.

굳이 한 함수에서 여러 값을 반환해야 한다면 값들을 레코드로 묶어서 반환해도 되지만, 임시 변수 추출 작업을 다른 방식으로 처리하는 것이 나을 때가 많다.

여기서는 **임시 변수를 질의 함수로 바꾸기**(7.4절)나 **변수를 쪼개는**(9.1절)식으로 처리하면 좋다.

<br/>

### 예시

```ts
import { LocalDateTime } from '@js-joda/core';

const printOwing = (invoice: any) => {
    let outstanding = 0;

    console.log('*******************');
    console.log('***** 고객채무 *****');
    console.log('*******************');

    for (const order of invoice.orders) {
        outstanding += order.amount;
    }

    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);

    // 세부 사항 출력
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
```

> 유효범위를 벗어나는 변수가 없을 때

여기서 '고객 채무'를 출력하는 코드는 아주 간단히 추출할 수 있다.

이는 전달할 매개변수가 없기 때문이다.

```ts
import { LocalDateTime } from '@js-joda/core';

const printBanner = () => {
    console.log('*******************');
    console.log('***** 고객채무 *****');
    console.log('*******************');
};

const printOwing = (invoice: any) => {
    let outstanding = 0;

    printBanner();

    for (const order of invoice.orders) {
        outstanding += order.amount;
    }

    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);

    // 세부 사항 출력
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
```

> 예시: 지역 변수를 사용할 때

지역 변수와 관련하여 가장 간단한 경우는 변수를 사용하지만 다른 값을 다시 대입하지는 않을 때다.

이 경우에는 지역 변수들을 그냥 매개변수로 넘기면 된다.

추가적으로 지역 변수가 (배열, 레코드, 객체와 같은) 데이터 구조라면 똑같이 매개변수로 넘긴 후 필드 값을 수정할 수 있다.

가령 마감일을 설정하는 코드는 다음과 같이 추출한다.

```ts
import { LocalDateTime } from '@js-joda/core';

const printBanner = () => {
    console.log('*******************');
    console.log('***** 고객채무 *****');
    console.log('*******************');
};

const printDetails = (invocie, outstanding) => {
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

const recordDueDate = (invoice) => {
    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);
};

const printOwing = (invoice: any) => {
    let outstanding = 0;

    printBanner();

    // 미해결 채무(outstanding)을 계산한다.
    for (const order of invoice.orders) {
        outstanding += order.amount;
    }

    recordDueDate(invoice);
    printDetails(invoice, outstanding);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
```

> 예시: 지역 변수의 값을 변경할 때

만약 매개변수에 값을 대입하는 코드를 발견하면 곧바로 **그 변수를 쪼개서**(9.1절) 임시 변수를 새로 하나 만들어 그 변수에 대입하게 한다.

만약 변수가 초기화되는 지점과 실제로 사용되는 지점이 떨어져 있다면 **문장 슬라이드하기**(8.6절)를 활용하여 변수 조작을 모두 한곳에 처리하도록 모아두면 편하다.

```ts
import { LocalDateTime } from '@js-joda/core';

const printBanner = () => {
    console.log('*******************');
    console.log('***** 고객채무 *****');
    console.log('*******************');
};

const printDetails = (invocie, outstanding) => {
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate?.toLocaleString()}`);
};

const recordDueDate = (invoice) => {
    const today: LocalDateTime = LocalDateTime.now();
    invoice.dueDate = today.plusDays(30);
};

const calculateOutstanding = (invoice) => {
    return invoice.orders((result, o) => {
        return result += o.amount;
    }, 0);
};

const printOwing = (invoice: any) => {
    printBanner();
    const outstanding = calculateOutstanding(invoice);
    recordDueDate(invoice);
    printDetails(invoice, outstanding);
};

printOwing({
    customer: 'BigCo',
    orders: [
        {name: '사채', amount: 100},
        {name: '대출', amount: 1000},
    ],
});
```

<br/>

## 6.2 함수 인라인하기

### 배경

함수 자체가 짧은 걸 권장하지만 때로는 함수 본문이 함수 이름만큼 명확한 경우가 있다면 함수를 제거하는 게 좋다.

쓸데없는 간접 호출은 거슬릴 뿐이다.

또 적용할 시점은 리팩터링 과정에서 잘못 추출한 함수들이 있다면 이를 제거하기 위해 인라인 할 수도 있다.

그리고 간접 호출을 너무 과하게 쓰는 경우가 있다면 즉 가령 다른 함수들로 위임만 하는 구조가 있다면 이를 인라인 하기도 한다.

<br/>

### 절차

1. 다형 메서드인지 확인한다.(서브클래스에서 오버라이드 하는 메서드는 인라인하면 안된다)
2. 인라인할 함수를 호출하는 곳을 모두 찾아서 교체한다.

<br/>

### 예시

다음 함수를 살펴보자.

```ts
const moreThanFiveLateDeliveries = (driver: any): boolean => driver.numberOfLateDeliveries > 5;
const rating = (driver: any): number => (moreThanFiveLateDeliveries(driver) ? 2 : 1);
```

호출하는 함수 반환문을 그대로 복사해서 호출하는 함수의 호출문을 덮어쓴다.

하나의 과정을 더 찾아봄을 줄임으로서 더 자명해진다.

```ts
const rating = (driver: any): number => (driver.numberOfLateDeliveries > 5 ? 2 : 1);
```

<br/>

## 6.3 변수 추출하기

### 배경

변수 추출을 고려한다고 함은 표현식에 이름을 붙이고 싶다는 뜻이다.

이름을 붙이기로 했다면 그 이름이 들어가 문맥도 살펴야 한다.

즉, 함수를 추출할 때 함수 내부에서 다양한 표현식이 잘 읽히지 않는다면 변수 추출하기를 한번 도입해 보자.

<br/>

### 절차

1. 추출하려는 표현식에 부작용은 없는지 확인한다.
2. 불변 변수를 선언하고 이름을 붙일 표현식의 복제본을 대입한다.
3. 원본 표현식을 새로 만든 변수로 교체한다.
4. 테스트한다.
5. 표현식을 여러 곳에서 사용한다면 각각 교체한다.

<br/>

### 예시: 함수 안에서

간단한 계산식에서 시작해보자.

```ts
const price = (order: Order) => {
    // 가격(price) = 기본 가격 - 수량 할인 + 배송비
    return order.quantity * order.itemPrice -
        Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
        Math.min(order.quantity * order.itemPrice * 0.1, 100);
};
```

가격을 구하는 표현식을 알지만 추후 나중에 볼 때 한 번에 와닿지 아니할 것 같지 않은가?

맥락대로 이름을 하나씩 지어주면 문제가 해결된다.

```ts
const price = (order: Order) => {
    const basePrice: number = order.quantity * order.itemPrice;
    const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
    const shipping = Math.min(order.quantity * order.itemPrice * 0.1, 100);

    return basePrice - quantityDiscount + shipping;
};
```

### 예시: 클래스 안에서

똑같은 코드를 클래스 문맥 안에서 처리하는 방법을 살펴보자.

```ts
class Order {
    private _data: any;

    constructor(data: any) {
        this._data = data;
    }

    get quantity(): number {
        return this._data.quantity;
    }

    get itemPrice(): number {
        return this._data.itemPrice;
    }

    get price(): number {
        return this.basePrice - this.qualityDiscount + this.shipping;
    }

    private get basePrice(): number {
        return this.quantity * this.itemPrice;
    }

    private get qualityDiscount(): number {
        return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;
    }

    private get shipping(): number {
        return Math.min(this.quantity * this.itemPrice * 0.1, 100);
    }
}
```

<br/>

## 6.4 변수 인라인하기

### 배경

변수는 함수 안에서 표현식을 가리키는 이름으로 쓰이며, 대체로 긍정적인 효과를 준다.

하지만 그 이름이 원래 표현식과 다를 바 없을 때도 있다.

이럴 때는 그 변수를 인라인하는 것이 좋다.

<br/>

### 절차

1. 대입문의 우변(표현식)에서 부작용이 생기지 않는지 확인한다.
2. 변수가 불변으로 선언되지 않았다면 불변으로 만든 후 테스트 한다. (이렇게 하면 변수가 값이 단 한번만 대입하는지 확인할 수 있다.)
3. 이 변수를 가장 처음 사용하는 코드를 찾아서 대입문 우변의 코드로 바꾼다.
4. 테스트한다.
5. 변수를 사용하는 모든 부분을 모두 교체하고 테스트한다.
6. 변수 선언문과 대입문을 지운다.
7. 테스트한다.

<br/>

### 예시

간단한 계산식에서 시작해보자.

```ts
const isGood = (order: Order) => {
    const itemPrice = order.itemPrice;
    return itemPrice > 10_000_000;
};
```

```ts
const isGood = (order: Order) => {
    return order.itemPrice > 10_000_000;
};
```

<br/>

## 6.5 함수 선언 바꾸기

### 배경

함수의 이름이 좋으면 함수의 구현 코드를 살펴볼 필요 없이 호출문만 보고도 무슨 일을 하는지 파악할 수 있다.

이름이 잘못된 함수가 있다면 무조건 바꾸자. 물론 좋은 이름을 한 번에 잘 지을 순 없다.

그렇지만 좋은 이름을 짓기 위한 팁이 있는데 **함수의 목적을 주석으로 설명해 보는 것이다.**

그러다 보면 주석이 멋진 이름으로 바뀌어 올 때가 있다.

**함수의 이름뿐 아니라 매개변수도 마찬가지다. 매개변수는 함수와 어울려서 함수의 문맥을 정해준다.**

예컨대 전화번호 포매팅 함수가 매개변수로 사람을 받는다고 하면 회사 전화번호는 사용할 수 없게 된다.

그러므로 사람보다는 전화번호 자체를 전달받도록 하는 게 더 좋다.

이렇게 하면 활용 범위가 넓어질 뿐 아니라, 다른 모듈과의 결합(coupling)도 줄어들 수 있다.

매개변수를 올바르게 선택하기는 단순히 규칙 몇 개로 표현할 수는 없다.

예컨대 대여한 지 30일이 지났는지를 기준으로 지불 기한이 넘었는지 판단하는 함수가 있다고 생각해 보자.

매개변수로 지불 객체가 적절할까? 마감일을 넘기는 게 적합할까?

마감일을 넘기면 날짜와만 결합하면 되므로 다른 모듈과 결합하지 않아도 된다. 즉 신경 쓸 요소가 적어진다.

지불 인터페이스를 전달하면 지불 인터페이스가 제공하는 여러 속성을 전달받을 수 있다.

즉, 매개변수는 정답이 없다는 것이다.

그러므로 각각에 장단점이 있기 때문에 우리가 취해야 하는 건 고칠 수 있는 능력을 갖추는 것이다.

이 리팩터링 기법을 잘 알아서 더 적합한 쪽으로 바꿀 수 있는 능력을 갖추면 된다.

<br/>

### 절차

'간단한 절차'만으로 충분할 때가 많지만, 더 세분된 '마이그레이션 절차'가 훨씬 적합한 경우도 많다.

따라서 이 리팩터링을 할 때는 먼저 변경 사항을 살펴보고 함수 선언과 호출문들을 한 번에 고칠 수 있는지 가늠해 본다.

가능해 보인다면 '간단한 절차'를 따른다.

호출하는 곳이 많거나, 호출 과정이 복잡하거나, 호출 대상이 다형 메서드거나, 선언선을 복잡하게 변경할 때는 '마이그레이션 절차'를 따른다.

**간단한 절차**

1. 매개변수를 제거하기 전에 먼저 함수 본문에서 매개변수를 참조하는 곳이 없는지 확인한다.
2. 메서든 선언을 원하는 형태로 바꾼다.
3. 기존 메서드 선언을 참조하는 부분을 모두 찾아서 바뀐 형태로 수정한다.
4. 테스트한다.

**마이그레이션 절차**

1. 이어지는 추출 단계를 수월하게 만들어야 한다면 함수 본문을 적절히 리팩터링한다.
2. 함수 본문을 새로운 함수로 추출한다. (새로 만들 함수 이름이 기존 함수와 같다면 일단 검색하기 쉬운 이름을 임시로 붙여둔다.)
3. 추출한 함수에 매개변수를 추가해야 한다면 '간단한 절차'를 따라 추가한다.
4. 테스트한다.
5. 기존 함수를 인라인한다.
6. 이름을 임시로 붙여뒀다면 함수 선언 바꾸기를 한번 더 적용해서 원래 이름으로 되돌린다.
7. 테스트 한다.

<br/>

### 예시: 함수 이름 바꾸기(간단한 절차)

**IDE를 사용하자.**

추가적으로 함수의 이름은 축약보다는 적확한 이름으로 고안하자.

팀내에서 상호 얘기를 통해 허용하는 축약어(Ip, http.. 등등 )는 허용하자.

```ts
const circum = (radius: number): number => {
    return 2 * Math.PI * radius;
};
```

```ts
const circumference = (radius: number): number => {
    return 2 * Math.PI * radius;
};
```

### 예시: 함수 이름 바꾸기(마이그레이션 절차)

이번에는 마이그레이션 절차를 따라 진행하겠다.

먼저 함수 본문 전체를 새로운 함수로 추출한다.

```ts
const circum = (radius: number): number => {
    return circumference(radius);
};
```

```ts
const circumference = (radius: number): number => {
    return 2 * Math.PI * radius;
};
```

새로운 함수를 호출하는 전달 메서드로 활용한다.

추후 이를 다른 함수로 대체된다고 한다. `circum()` 함수를 'deprecated'임을 표시한다.

그런 다음 `circum()`의 클라이언트들 모두가 `circumference()`를 사용하게 바뀔 때까지 기다린다.

### 예시: 매개변수 추가하기

도서 관리 프로그램에서 책에 대한 예약 기능이 구현되어 있다고 가정해 보자.

여기서 새로운 요구사항으로 우선순위 큐를 지원하라는 기능이 들어왔다.

이 기능을 지원하기 위해서 매개변수로 일반 큐를 사용할지 우선순위 큐를 사용할지 여부를 추가하려고 한다.

여기서는 한 번에 변경하기 힘들므로 `마이그레이션 절차`로 진행한다고 가정해 보자.

일단 다음과 같은 예약자를 추가하는 기능이 있다.

```ts
class Book {
    private readonly _reservations: any[] = [];

    public addReservation(customer: { name: string }): void {
        this._reservations.push(customer);
    }
}
```

`마이그레이션 절차`에 따라 다음과 같이 변경했다.

```ts
class Book {
    private readonly _reservations: any[] = [];

    public addReservation(customer: Customer): void {
        this.priorityAddReservation(customer);
    }

    private priorityAddReservation(customer: Customer): void {
        this.reservations.add(customer);
    }
}
```

그 다음 우선순위 파라미터를 넣자.

```ts
class Book {
    private readonly _reservations: any[] = [];

    public addReservation(customer: Customer): void {
        this.priorityAddReservation(customer, false);
    }

    private priorityAddReservation(customer: Customer, isPriority: boolean): void {
        assert(typeof isPriority === 'boolean'); // ts guaranteed
        this.reservations.add(customer);
    }
}
```

이런식으로 만든 다음에 완전히 완료가 되면 기존 함수를 인라인하면 된다.

이후 `priorityAddReservation`을 사용한다.

### 예시: 매개변수를 속성으로 바꾸기

고객이 뉴잉글랜드에 살고 있는지 확인하는 함수가 있다고 하자.

```ts
const inNewEngland = (customer: any) => {
    return ['MA', 'CT', 'ME', 'VT', 'NH', 'RI'].includes(customer.address.state);
};

const newEnglanders = someCustomers.filter(c => inNewEngland(c));
```

`inNewEngland()`함수는 고객이 거주하는 주 이름을 보고 뉴잉글랜드에 사는지 판단한다.

이 함수가 주(state) 식별 코드를 매개변수로 받도록 리팩터링할 것이다.

그러면 고객에 대한 의존성이 제거되어 더 넓은 문맥에 활용할 수 있기 때문이다.

```ts
const inNewEngland = (customer: any) => {
    const stateCode = customer.address.state;
    return tempFunc(stateCode);
}

const tempFunc = (stateCode) => {
    return ['MA', 'CT', 'ME', 'VT', 'NH', 'RI'].includes(stateCode);
}
```

```ts
const inNewEngland = (stateCode: any) => {
    return ['MA', 'CT', 'ME', 'VT', 'NH', 'RI'].includes(stateCode);
}
```

<br/>

## 6.6 변수 캡슐화하기

### 배경

함수는 데이터보다 다루기 수월하다.

함수는 사용한다는 건 대체로 호출한다는 뜻이고, 함수의 이름을 바꾸거나 다른 모듈로 옮기기는 어렵지 않다.

여차하면 기존 함수를 그대로 둔채 전달함수로 활용할 수 도 있기 때문이다.

이런 전달함수를 오래 남겨둘 일을 별로 없지만 리팩터링 작업을 간소화하는 데 큰 역할을 한다.

반대로 데이터는 데이터를 참조하는 모든 부분을 바꿔줘야 한다.

짧은 함수 안의 임시 변수처럼 유효범위가 아주 좁은 데이터는 문제가 되지 않지만 이러한 이유로 전역 데이터가 골칫거리가 될 수 있다.

그래서 유효범위가 넓은 데이터는 먼저 그 데이터의 접근을 독점하는 함수를 만드는 게 가장 좋다.

이렇게 데이터 캡슐화를 하면 이점이 있는데 데이터 변경 전이나 변경 후 추가 로직을 쉽게 넣는 게 가능하다.

나는 유효범위가 함수 하나보다 넓은 가변 데이터는 모두 이런 식으로 캡슐화를 한다.

레거시 코드를 다룰 때는 이런 변수를 참조하는 코드를 추가하거나 변경할 때마다 최대한 캡슐화를 한다.

그래야 자주 사용하는 데이터에 대한 결합도가 높아지는 일을 막을 수 있다.

데이터 자체로 접근한다면 변경의 어려움이 있어서, 데이터 그 자체로 바로 접근해서 사용하는 경우는 문제가 많이 발생한다.

나는 'public'필드를 발견할 때마다 'private'로 변경하고 캡슐화를 한다.

여기서 불변 데이터의 경우에는 가변 데이터보다 캡슐화할 이유가 적다.

데이터가 변경될 일이 없어서 갱신 검증이나 추가 로직이 있을 필요가 없기 때문이다.

<br/>

### 절차

1. 변수로의 접근과 갱신을 전담하는 캡슐화 함수를 만든다.
2. 정적 검사를 수행한다.
3. 변수를 직접 참조하던 부분을 모두 적절한 캡슐화 함수 호출로 바꾼다. 하나씩 바꿀 때마다 테스트한다.
4. 변수의 접근 범위를 제한한다.
5. 테스트한다.

<br/>

### 예시

```ts
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
```

주로 getter가 데이터의 복제본을 반환, 혹은 새로운 객체를 반환하도록 수정하는 식으로 처리한다.

혹은 참조값을 가지는 인자가 있다면, 깊은 복사를 통해 복제본을 반환한다.

즉, 예상치 못한 수정을 방어해야 한다.

```ts
let defaultOwnerData: any = {firstName: '마틴', lastName: '파울러'};

const defaultOwner = () => ({...defaultOwnerData}); // 얉은 복사
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

const defaultPerson = () => new Person(defaultOwnerData);

class Person {
    private readonly _firstName: string;
    private readonly _lastName: string;

    public constructor(data: any) {
        this._firstName = data.firstName;
        this._lastName = data.lastName;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }
}
```

<br/>

## 6.7 변수 이름 바꾸기

### 배경

축약어 보다는 명확한 이름을 짓도록 노력하자.

<br/>

### 절차

1. 폭 넓게 쓰이는 변수라면 **변수 캡슐화 하기**(6.8절)를 고려한다.
2. 이름을 바꿀 변수를 참조하는 곳을 모두 찾아서 하나씩 변경한다.
3. 테스트 한다.

<br/>

### 예시

변수명을 변경할 때는 **IDE를 사용하자.**

변수에 할당하는 과정에서 어떠한 값을 직접적으로 넣는 것보다는 **setter**를 만들어서 캡슐화를 진행한다.

즉, **변수 캡슐화하기**(6.6절)로 처리한다.

<br/>

## 6.8 매개변수 객체 만들기

### before

```ts
import { LocalDate } from '@js-joda/core';

const amountInvoiced = (startDate: LocalDate, endDate: LocalDate) => {
};
const amountReceived = (startDate: LocalDate, endDate: LocalDate) => {
};
const amountOverdue = (startDate: LocalDate, endDate: LocalDate) => {
};
```

### after

```ts
import { LocalDate } from '@js-joda/core';

class DateRange {
    private readonly _startDate: LocalDate;
    private readonly _endDate: LocalDate;

    public constructor(startDate, endDate) {
        this._startDate = startDate;
        this._endDate = endDate;
    }
}

const amountInvoiced = (dateRange: DateRange) => {
};
const amountReceived = (dateRange: DateRange) => {
};
const amountOverdue = (dateRange: DateRange) => {
};
```

### 배경

데이터 항목 여러 개가 이 함수에서 저 함수로 함께 몰려다니는 경우를 자주 본다.

나는 이런 데이터 무리를 발견하면 하나의 데이터 구조로 모아주곤 한다.

이 리팩터링의 진정한 힘은 코드를 더 근본적으로 바꿔 준다는 데 있다.

이런 데이터 구조를 새로 발견하면 이 데이터 구조를 활용하는 형태로 프로그램 동작을 재구성한다.

데이터 구조를 넘어서 단순히 DTO를 넘어서는 message 전달 + 책임을 가지는 클래스로 될 수 있다.

그러면 놀라울 정도로 강력한 효과를 낸다.

<br/>

### 절차

1. 적당한 데이터 구조가 없다면 새로 만든다. (클래스로 만드는 걸 선호한다. 나중에 동작까지 함께 묶기 좋기 때문이다.)
2. 테스트 한다.
3. 함수 선언 바꾸기(6.5절)로 새 데이터 구조를 매개변수로 추가한다.
4. 테스트 한다.
5. 함수 호출 시 새로운 데이터 구조 인스턴스를 넘기도록 수정한다. 하나씩 수정할 때마다 테스트한다.
6. 기존 매개변수를 사용하던 코드를 새 데이터 구조의 원소로 사용하도록 바꾼다.
7. 다 바꿨다면 기존 매개변수를 사용하는 함수는 제거하고 테스트 한다.

<br/>

### 예시

온도 측정값 배열에서 정상 작동 범위를 벗어나는 코드가 있는지 검사하는 코드를 살펴보자.

```ts
const station = {
    name: 'ZB1',
    readings: [
        {temp: 47, time: '2016-11-10 09:10'},
        {temp: 53, time: '2016-11-10 09:20'},
        {temp: 58, time: '2016-11-10 09:30'},
        {temp: 53, time: '2016-11-10 09:40'},
        {temp: 51, time: '2016-11-10 09:50'},
    ],
};
const operatingPlan = {
    temperatureFloor: 50,
    temperatureCeiling: 56,
};

const readingsOutsideRange = (station: any, min: number, max: number) =>
    station.readings.filter((r: any) => r.temp < min || r.temp > max);

console.log(readingsOutsideRange(station, operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling));
```

위에서 호출 코드에는 최저 온도, 최고 온도 데이터 두 개를 쌍으로 `readingsOutsideRange()` 함수에 전달한다.

**범위**라는 개념으로 객체 하나로 묶어서 전달할 수 있다.

```ts
class NumberRange {
    constructor(
        private readonly _min: number,
        private readonly _max: number,
    ) {
    }

    public contains(number: number) {
        return number >= this._min && number <= this._max;
    }
}

const range = new NumberRange(operatingPlan.temperatureFloor, operatingPlan.temperatureCeiling);
const readingsOutsideRange = (station: any, range: NumberRange) =>
    station.readings.filter((r: any) => !range.contains(r.temp));

console.log(readingsOutsideRange(station, range));
```

앞에서처럼 클래스로 만들고, 관련 동작들을 이 클래스로 옮길 수 있따는 이점이 생긴다.

이 예에서는 온도가 허용 범위 안에 있는지 검사하는 메서드를 클래스에 추가할 수 있다.

이러한 값 쌍이 어떻게 사용되는지 살펴보면 다른 유용한 동작도 범위 클래스로 옮겨서 코드베이스 전반에서 값을 활용하는 방식을 간소화할 수 있다.

진정한 값 객체로 만들기 위해 값에 기반한 동치성 검사 메서드부터 추가할 것이다.

<br/>

## 6.9 여러 함수를 클래스로 묶기

### 배경

나는 (흔히 함수 호출 시 인수로 전달되는) 공통 데이터를 중심으로 긴밀하게 엮어 사용하는 함수가 여럿 있다면 이들을 하나의 클래스로 묶고 싶다.

클래스로 묶으면 이 함수들이 공유하는 공통 환경을 더 명확하게 표현하는 게 가능해진다.

그리고 각 함수에 전달되는 인수를 줄여서 함수 호출이 더 간결하게 만들 수 있다.

이 리팩토링은 기존의 함수들을 재구성할 때와 새로 만든 클래스와 관련해 놓친 연산을 찾아서 새 클래스의 메서드로 뽑아내는 것도 좋다.

함수를 한데 묶는 또 다른 방법으로는 **여러 함수를 변환 함수로 묶기**(6.10 절) 기법도 있어서 이건 맥락에 따라 잘 결정해야 한다.

<br/>

### 절차

1. 함수들이 공유하는 공통 데이터 레코드를 **캡슐화**(7.1절) 한다.
2. 공통 레코드를 사용하는 함수 각각을 새 클래스로 옮긴다. (함수 옮기기 (8.1절))
3. 데이터를 조작하는 로직들은 **함수로 추출**(6.1절)해서 새 클래스로 옮긴다.

<br/>

### 예시

사람들은 매달 차(tea) 계량기를 읽어서 측정값(reading)을 다음과 같이 기록한다고 하자.

```ts
const acquireReading = () => ({
    customer: 'ivan',
    quantity: 10,
    month: 5,
    year: 2017,
});

const baseRate = (month: number, year: number) => year - 2000 + month;

const client1 = () => {
    const reading: any = acquireReading();
    const baseCharge: number = baseRate(reading.month, reading.year) * reading.quantity;
    return baseCharge;
};

const client2 = () => {
    const taxThreshold = (year: number) => (year - 2000) * 0.1;
    const reading: any = acquireReading();
    const base: number = baseRate(reading.month, reading.year) * reading.quantity;
    const taxableCharge: number = Math.max(0, base - taxThreshold(reading.year));
    return taxableCharge;
};

const client3 = () => {
    const reading = acquireReading();
    const calculateBaseCharge = (reading: any) => baseRate(reading.month, reading.year) * reading.quantity;
    const basicChargeAmount = calculateBaseCharge(reading);
    return basicChargeAmount;
};

[client1, client2, client3].forEach(c => console.log(c()));
```

기본요금 계산 공식이 똑같이 등장하는 것을 발견했다.

```ts
const baseRate = (month: number, year: number) => year - 2000 + month;
const taxThreshold = (year: number) => (year - 2000) * 0.1;

class Reading {
    private readonly _customer: any;
    private readonly _quantity: number;
    private readonly _month: number;
    private readonly _year: number;

    public constructor(data: any) {
        this._customer = data.customer;
        this._quantity = data.quantity;
        this._month = data.month;
        this._year = data.year;
    }

    public get customer(): any {
        return this._customer;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public get month(): number {
        return this._month;
    }

    public get year(): number {
        return this._year;
    }

    public get baseCharge(): number {
        return baseRate(this._month, this._year) * this._quantity;
    }

    public get taxableCharge(): number {
        return Math.max(0, this.baseCharge - taxThreshold(this._year));
    }
}

const client1 = () => {
    const reading: Reading = new Reading(acquireReading());
    return reading.baseCharge;
};

const client2 = () => {
    const reading: Reading = new Reading(acquireReading());
    return reading.taxableCharge;
};

const client3 = () => {
    const reading = new Reading(acquireReading());
    return reading.baseCharge;
};

[client1, client2, client3].forEach(c => console.log(c()));
```

결론적으로, 하나의 데이터 뭉치를 통해 비슷한 연산을 수행하는 부분을 연결 짓고 이를 하나의 클래스로 묶을 수 있다.

<br/>

## 6.10 여러 함수를 변환 함수로 묶기

### 배경

소프트웨어는 데이터를 입력받아서 여러 가지 정보를 도출한다.

이 정보가 사용되는 곳마다 반복적인 도출 로직이 일어나는 곳이 있다.

이렇게 도출된 정보를 바탕으로 비슷한 도출 로직이 또 일어나는 경우가 있다.

이 경우에는 이런 도출 작업을 한 곳으로 모은다.

이 방법으로 변환 함수(transform)를 적용할 수 있다.

변환 함수는 원본 데이터를 받아서 필요한 정보를 도출하고 출력 데이터를 만들어서 이를 반환하는 방법이다.

이 변환 함수의 특징은 여러 곳에서 도출하는 게 아니라 변환 함수만 바라보도록 하는 것이 특징이다.

이 방법 대신 **여러 함수를 클래스로 묶기**(6.9절)로 처리해도 된다.

<br/>

### 절차

1. 변환할 레코드를 입력받아서 값을 그대로 반환하는 변환 함수를 만든다. (이 작업은 깊은 복사를 이용하자.)
2. 묶을 함수 중 하나를 골라서 본문 코드를 변환 함수로 옮기고, 처리 결과를 레코드에 새 필드로 기록한다. 그런 다음 클라이언트가 이 필드를 사용하도록 수정한다.
3. 테스트 한다.
4. 나머지 묶을 함수들도 반복해서 처리한다.

<br/>

### 예시

```ts
import _ from 'lodash';

const acquireReading = (): any => ({
    customer: 'ivan',
    quantity: 10,
    month: 5,
    year: 2017,
});
const baseRate = (month: number, year: number) => year - 2000 + month;
const taxThreshold = (year: number) => (year - 2000) * 0.1;

export const enrichReading = (original: any) => {
    // 1. 먼저 입력 객체를 그대로 복사
    const result: any = _.cloneDeep(original);

    // 2. baseCharge 부가 정보를 덧붙임
    result.baseCharge = calculateBaseCharge(result);

    // 3. taxableCharge 부가 정보를 덧붙임
    result.taxableCharge = Math.max(0, result.baseCharge - taxThreshold(result.year));
    return result;
};

const calculateBaseCharge = (result: any) => {
    return baseRate(result.month, result.year) * result.quantity;
};

const client1 = () => {
    const reading: any = enrichReading(acquireReading());
    return reading.baseCharge;
};

const client2 = () => {
    const reading = enrichReading(acquireReading());
    return reading.taxableCharge;
};

const client3 = () => {
    const reading = enrichReading(acquireReading());
    return reading.baseCharge;
};

[client1, client2, client3].forEach(c => console.log(c()));
```

> 참고로 본질은 같고 부가 정보만 덧붙이는 변환 함수의 이름을 "enrich"라 하고, 형태가 변할 때만 "transform"이라는 이름을 쓴다.


여기서 주의할 점은 `enrichReading()` 같은 변환함수는 원본을 변경하면 안 된다는 것이다.

그래서 이에 대비해서 테스트 코드를 짜놔야 한다.

<br/>

## 6.11 단계 쪼개기

### 배경

나는 서로 다른 두 대상을 한꺼번에 다루는 코드를 발견하면 각각을 별개의 모듈로 나누는 방법을 찾는다.

두 대상을 한 번에 생각하는 것이 아니라 하나에만 집중하기 위해서다.

모듈이 잘 분리되어 있다면 다른 모듈의 상세 내용은 전혀 기억하지 않아도 된다는 장점이 있다.

이렇게 하기 위해 가장 간편한 방법은 동작을 연이은 두 단계로 쪼개는 것이다.

입력이 처리 로직에 적합하지 않은 형태로 들어오는 경우를 생각해 보자.

이럴 때는 본 작업 전에 입력값을 다루기 편한 형태로 가공해야 한다.

아니면 로직을 순차적인 단계들로 분리해도 된다.

**중요한 건 각 단계는 서로 확연히 다른 일을 수행해야 한다.**

이런 과정은 컴파일러와 유사하다.

컴파일러는 기본적으로 어떤 텍스트(code)를 입력받아서 실행할 수 있는 형태(하드웨어에 맞는 목적 코드(object code))로 변환한다.

컴파일러는 지속해서 발전하면서 여러 단계로 구성되는 게 좋다고 판단되었는데 과정은 다음과 같다.

1. 텍스트를 토큰화
2. 토큰을 파싱해서 구문 트리 만들기
3. (최적화등) 구문 트리 변환해서 목적 코드 만들기

**각 단계는 자신의 목적만 집중하기 때문에 나머지 단계를 몰라도 된다.**

즉 자신의 문제만 해결하면 된다.

이렇게 단계를 쪼개는 기법은 주로 덩치 큰 소프트웨어에 적용된다.

가령 컴파일러의 매 단계든 다수의 함수와 클래스로 구성된다.

하지만 나는 규모와 관계없이 여러 단계로 분리하면 좋을 만한 코드를 발견할 때마다 기본적으로 단계 쪼개기 리팩터링한다.

코드 영역들이 마침 서로 다른 데이터와 함수를 사용한다면 이는 단계 쪼개기에 적합하다는 뜻이다.

이렇게 별개의 모듈로 분리하면 코드를 훨씬 분명하게 드러내는 게 가능하다.

<br/>

### 절차

1. 두 번째 단계에 해당하는 코드를 독립 함수로 추출한다.
2. 테스트한다.
3. 중간 데이터 구조를 만들고 앞에서 추출한 함수의 인수로 추가한다.
4. 테스트한다.
5. 추출한 두 번째 단계 함수의 매개변수를 하나씩 검토한다. 그 중 첫 번째 단계에서 사용되는 것은 중간 데이터 구조로 옮긴다. 하나씩 옮길 때마다 테스트한다. (그리고 가령 두 번째 단계에서 사용하면 안 되는
   매개변수가 있다. 이는 중간 데이터 구조로 옮기고 이 필드를 설정하는 문장을 호출한 곳으로 옮긴다)
6. 첫 번째 단계 코드를 함수로 추출하면서 중간 데이터 구조를 반환하도록 만든다.

<br/>

### 예시

상품의 결게 금액을 계산하는 코드이다.

```ts
import { readJSON } from '../../file.controller';
import * as path from 'path';

const products = readJSON(path.join(__dirname, '11-products.json'));
const shippingMethod: any = {
    discountFee: 0.1,
    feePerCase: 0.03,
    discountThreshold: 0.12,
};

const priceOrder = (product: any, quantity: number, shippingMethod: any) => {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    const shippingPerCase =
        basePrice > shippingMethod.discountThreshold ? shippingMethod.discountFee : shippingMethod.feePerCase;
    const shippingCost = quantity * shippingPerCase;
    const price = basePrice - discount + shippingCost;
    return price;
};

products.forEach((product: any) => {
    console.log(priceOrder(product, 10, shippingMethod));
});
```

결제 금액은 상품 정보를 이용해 상품 가격(basePrice)을 계산, 배송정보를 이용해 결제 금액 중 배송비(shippingCost)를 계산한다.

그러므로 이 코드는 두 단계로 나누는 것이 좋다.

먼저 배송비(shippingCost) 계산 부분을 함수로 추출하자.

```ts
const priceOrder = (product: any, quantity: any, shippingMethod: any) => {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    const price = applyShipping(basePrice, shippingMethod, quantity, discount);
    return price;
};

const applyShipping = (basePrice: number, shippingMethod, quantity: number, discount: number) => {
    const shippingPerCase = basePrice > shippingMethod.discountThreshold ? shippingMethod.discountFee : shippingMethod.feePerCase;
    const shippingCost: number = quantity * shippingPerCase;
    const price = basePrice - discount + shippingCost;
    return price;
};
```

첫 번째 단계(상품 가격, discount)와 두 번째 단계(shippingCost)가 주고받을 중간 데이터 구조를 만든다.

```ts
const priceOrder = (product: any, quantity: any, shippingMethod: any) => {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    const priceData = {basePrice, discount, quantity};
    const price = applyShipping(shippingMethod, quantity);
    return price;
};

const applyShipping = (priceData, shippingMethod) => {
    const shippingPerCase = priceData.basePrice > shippingMethod.discountThreshold ? shippingMethod.discountFee : shippingMethod.feePerCase;
    const shippingCost: number = priceData.quantity * shippingPerCase;
    const price = priceData.basePrice - priceData.discount + shippingCost;
    return price;
};
```

이제 첫 번째 단계를 처리하는 함수를 따로빼내자.

근데 가만 보면 첫번 째 `priceData`를 얻는 과정이 '상품 가격', 'discount'를 얻는 과정이다.

```ts
const priceOrder = (product: any, quantity: any, shippingMethod: any) => {
    return applyShipping(calculatePriceData(product, quantity), shippingMethod);
};

const calculatePriceData = (product: any, quantity: any) => {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0) * product.basePrice * product.discountRate;
    return {basePrice, quantity, discount};
};

const applyShipping = (priceData: any, shippingMethod: any) => {
    const shippingPerCase = priceData.basePrice > shippingMethod.discountThreshold ? shippingMethod.discountFee : shippingMethod.feePerCase;
    const shippingCost: number = priceData.quantity * shippingPerCase;
    return priceData.basePrice - priceData.discount + shippingCost;
};
```

### 예시: 명령줄 프로그램 쪼개기

JSON 파일에 담긴 주문의 개수를 세는 프로그램을 살펴보자.

```ts
/**
 * cmd: ts-node chapter06/src/11-2.ts -r chapter06/src/11-products.json
 */
import { readJSON } from '../../file.controller';

console.log(process.argv);

class Order {
    private readonly _product: any;

    constructor(product: any) {
        this._product = product;
    }

    public get product(): any {
        return this._product;
    }
}

const main = () => {
    try {
        const argv: string[] = process.argv;
        if (argv.length < 3) {
            throw new Error('파일명을 입력하세요');
        }
        const filename = argv[argv.length - 1];
        const input = readJSON(filename);
        const orders = input.map((item: any) => new Order(item));

        if (argv.includes('-r')) {
            const readyOrders = orders.filter((o: any) => o.product.status === 'ready');
            console.log('ready', readyOrders.length);
        } else {
            console.log('not ready', orders.length);
        }
    } catch (err) {
        console.error(err);
    }
};

main();
```

위 코드는 두 가지 일을 한다. 하나는 주문 목록을 읽어서 개수를 세고, 다른 하나는 명령줄 인수를 담은 배여을 읽어서 프로그램의 동작을 결정한다.

첫 번째 단계는 명령줄 인수의 구문을 분석해서 의미를 추출한다.

두 번째 단계는 이렇게 추출된 정보를 이용하여 데이터를 적절히 가공한다.

```ts
/**
 * cmd: ts-node chapter06/src/11-2.ts -r chapter06/src/11-products.json
 */
import { readJSON } from '../../file.controller';

console.log(process.argv);

class Order {
    private readonly _product: any;

    constructor(product: any) {
        this._product = product;
    }

    public get product(): any {
        return this._product;
    }
}

class CommandLine {
    private readonly _filename: string;
    private readonly _onlyCountReady: boolean;

    constructor(args: string[]) {
        if (args.length  === 0) {
            throw new Error('파일명을 입력하세요');
        }
        this._filename = args[args.length - 1];
        this._onlyCountReady = args.includes('-r');
    }

    get filename(): string {
        return this._filename;
    }

    get onlyCountReady(): boolean {
        return this._onlyCountReady;
    }
}

const run = (args: string[]) => {
    return countOrders(new CommandLine(args));
};

const countOrders = (commandLine: CommandLine) => {
    const input = readJSON(commandLine.filename);
    const orders = input.map((item: any) => new Order(item));

    if (commandLine.onlyCountReady) {
        const readyOrders = orders.filter((o: any) => o.product.status === 'ready');
        return `ready: ${readyOrders.length}`;
    } else {
        return `not ready: ${orders.length}`;
    }
};

const main = () => {
    try {
        console.log(run(process.argv.slice(2)));
    } catch (err) {
        console.error(err);
    }
};
main();
```

핵심은 어디까지나 단계를 명확히 분리하는 데 있기 때문이다.
