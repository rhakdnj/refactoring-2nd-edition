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

함수 추출하기는 늘 이름 짓기가 동반되므로 이름을 잘 지어야만 이 리팩토링의 효과가 발휘된다.

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
