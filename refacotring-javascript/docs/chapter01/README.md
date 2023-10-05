# 리팩터링: 첫 번째 예시

---

간단한 예시를 가지고 시작하겠다.

<br/>

## 1.1 자 시작해보자.

---

다양한 연극을 외주로 받아서 공연하는 극단이 있다고 생각해 보자.

공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다.

현재 이 극단은 두 가지 장르, 비극(tragedy)과 희극(comedy)만 공연한다.

그리고 공연료와 별개로 포인트(volume credit)를 지급해서 다음번 의뢰 시 공연료를 할인받을 수 있다.

극단은 공연할 연극 정보를 다음과같이 간단한 JSON 파일(코드 1)에 저장한다.

> plays.json (코드 1)

```json
{
  "hamlet": {
    "name": "hamlet",
    "type": "tragedy"
  },
  "as-like": {
    "name": "As You Like It",
    "type": "comedy"
  },
  "othello": {
    "name": "Othello",
    "type": "tragedy"
  }
}
```

공연료 청구서에 들어갈 데이터도 다음과 같이 JSON 파일(코드 2)로 표현한다.

> invoice.json (코드 2)

```json
[
  {
    "customer": "BigCo",
    "performances": [
      {
        "playID": "hamlet",
        "audience": 55
      },
      {
        "playID": "as-like",
        "audience": 35
      },
      {
        "playID": "othello",
        "audience": 40
      }
    ]
  }
]
```

공연료 청구서를 출력하는 코드는 다음과 같이 간단히 `statement` 메소드(코드 3)로 구현했다.

> statement.ts (코드 3)

```ts
const statement = (invoice: any, plays: any) => {
  let totalAmount: number = 0;
  let volumeCredits: number = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy': {
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      }
      case 'comedy': {
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // comedy 장르는 관객 5명마다 추가 포인트를 제공한다.
    if (play.type === 'comedy') {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // 청구 내역을 출력한다.
    result += `  ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
};

export default statement;
```

`statement()`함수의 결과는 다음과 같다.

```text
청구 내역 (고객명: BigCo)
  Hamlet: $650.00 (55석)
  As You Like It: $580.00 (35석)
  Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
```

<br/>

## 1.2 예시 프로그램을 본 소감

---

프로그램의 구조가 빈약하다면 대체로 구조부터 바로 잡은 뒤에 기능을 수정하는 편이 훨씬 수월하다.

> 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩토링하고 나서 원하는 기능을 추가한다.

자 이 코드에서 사용자의 입맛에 맞게 수정할 부분을 몇 개 발견했다.

가장 먼저 청구 내역을 HTML로도 출력하는 기능이 필요하다.

우선 HTML 태그를 삽입해야 하고 statement() 함수에서 조건문에 따라서 HTML 혹은 단순 텍스트로 출력하도록 추가할 것이다.

그러면 `statement()` 함수의 복잡도가 많이 증가한다.

이런 문제 때문에 기존에 존재하는 `statement()` 함수의 복사본을 만들어서 `htmlStatement()` 로 만들어서 사용하기도 할 것이다.

이렇게 되면 코드의 중복이 발생하고 변경 포인트가 두 개가 된다.

두 번째 변경 사항으로 배우들이 가면극, 마술, 인형극 등 더 많은 장르가 추가 될 수 있다.

이러한 확장(변경)은 공연료와 적립 포인트 계산법에 영향을 줄 것이다.

이처럼 연극 장르와 공연료 정책이 달라질 때마다 `statement()` 함수를 수정해야 한다.

리팩토링이 필요한 이유는 바로 이러한 변경(확장) 때문이다. 잘 작동하고 나중에 변경할 일이 없다면 코드를 현재 상태로 나눠도 아무런 문제가 없다.

더 다듬어 두면 물론 좋겠지만 누군가 코드를 읽지 않는 한 아무런 피해가 없다.

하지만 다음에 다른 사람이 읽고 이해해야 할 일이 생겼는데 로직을 파악하기 어렵다면 뭔가 대책을 마련해야 한다.

<br/>  

## 1.3 리팩토링의 첫 단계

---

리팩토링의 첫 단계는 항상 똑같다.

리팩토링할 코드가 잘 작동하는지 검사해 줄 테스트 코드를 만드는 것이다.

리팩토링에서 테스트의 역할은 굉장히 중요하다.

리팩토링 기법들로 버그의 발생 여지를 최소화한다고는 하지만 사람이 수행하는 일은 언제든 실수할 수 있다.

`statement()` 함수의 테스트는 어떻게 구현하면 될까?

이 함수가 문자열을 반환하므로 다양한 장르와 공연들로 구성된 형태를 몇 개 작성해서 문자열 형태로 준비해 둔다. 즉 시나리오를 준비해 둔다.

테스트 결과는 눈으로 보지 말고 시스템이 판단하도록 한다. (테스트 결과가 성공하면 초록불이 실패하면 빨간불이 발생하듯이)

정리하자면 다음과 같다.

**리팩토링하기 전에 제대로 된 테스트를 마련한다. 테스트는 반드시 자가 진단하도록 한다.**

리팩토링에서 테스트의 역할이 굉장히 중요하기 때문에 4장 전체를 테스트에 할애했다.

<br/>  

## 1.4 statement() 함수 쪼개기

---

`statement()`처럼 긴 함수를 리팩토링할 때는 먼저 전체 동작을 각각의 부분으로 나눌 수 있는 지점을 찾는다.

그러면 중간쯤의 switch 문이 가장 눈에 띌 것이다.

> statement.ts (코드 3)

```ts
const statement = (invoice: any, plays: any) => {
  let totalAmount: number = 0;
  let volumeCredits: number = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    // TODO: switch문을 분리
    switch (play.type) {
      case 'tragedy': {
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      }
      case 'comedy': {
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    volumeCredits += Math.max(perf.audience - 30, 0);
    if (play.type === 'comedy') {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `  ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
};

export default statement;
```

switch 문을 살펴보면 극의 종류에 따라 요금을 계산하는 방식을 볼 수 있다.

이러한 사실은 코드 분석을 하면서 얻은 정보다.

워드 커닝햄(Ward Cunningham)이 말하길, 이런 식으로 파악한 정보는 휘발성이 높기로 악명 높은 저장 장치인 내 머릿속에 기록되므로, 잊지 않으려면 재빨리 코드에 반영해야 한다.

그러면 다음번에 코드를 볼 때, 다시 분석하지 않아도 코드 스스로가 자신이 하는 일이 무엇인지 이야기해 줄 것이다.

여기서는 코드 조각을 별도 함수로 추출하는 방식으로 앞서 파악한 정보를 코드에 반영할 것이다.

추출한 함수에는 그 코드가 하는 일을 설명하는 이름을 지워준다.

이름은 `amountFor(performance)` 정도면 적당해 보인다.

나는 이렇게 코드 조각을 함수로 추출할 때 실수를 최소화해 주는 절차를 마련해 뒀다.

이 절차를 따로 기록해 두고, 나중에 참조하기 쉽도록 '함수 추출하기'란 이름을 붙였다.

먼저 별도 함수로 빼냈을 때 유효범위를 벗어나는 변수, 즉 새 함수에서 필요한 변수들을 뽑는다.

여기서는 performance, play, thisAmount 가 있다.

performance와 play는 값을 참조만 하기에(값을 변경하지 않기에) 새 함수의 파라미터로 전달하면 된다.

반면에 thisAmount는 새 함수안에서 값을 변경하므로 이는 주의해서 다뤄야 한다.

여기서는 새 함수에서 변경하는 함수가 thisAmount 밖에 없으니까 이것을 새 함수에서 선언하고 리턴해주는 방식으로 사용하면 된다.

이렇게 리팩토링한 결과는 코드 4와 같다.

> amountFor() 내부 메서드 (코드 4)

```ts
const statement = (invoice: any, plays: any) => {
  const amountFor = (performance: any, play: any) => {
    let result = 0;
    switch (play.type) {
      case 'tragedy': {
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      }
      case 'comedy': {
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }
    return result;
  };

  let totalAmount: number = 0;
  let volumeCredit: number = 0;
  // ...

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);
    // ...
  }
  // ...
};
```

이렇게 리팩토링할 때마다 곧바로 테스트를 돌려서 제대로 작동하는지 확인한다.

아무리 간단한 리팩토링이라고 하더라도 리팩토링 후에는 항상 테스트 습관을 들이는 것이 바람직하다.

**한 가지를 수정할 때마다 테스트하면, 오류가 생기더라도 변경 폭이 작기 때문에 문제를 찾고 해결하기가 훨씬 쉽다.**

**함수를 추출하고 나면 추출된 함수 코드를 자세히 들여다보면서 지금보다 명확하게 표현할 수 있는 간단한 방법은 없는지 검토한다.**

가장 먼저 변수의 이름을 더 명확하게 바꿔보자.

thisAmount의 이름은 result로 변경할 수 있다.

나는 함수의 반환 값에는 항상 result라는 이름을 쓴다.

이번에도 마찬가지로 테스트를 돌려보자.

다음으로 play 매개변수의 이름을 바꿀 차례다. 그런데 이 변수는 좀 다르게 처리해야 한다.

### Play 변수 제거하기

`amountFor()`함수를 다시 천천히 살펴보자. performance 파라미터는 루프 변수에서 오기 때문에 자연스레 값이 변경된다.

하지만 play는 performance에서 얻을 수 있다.

즉, 그냥 계산해 주는 함수를 만들면 된다.

나는 긴 함수를 잘게 쪼갤 때마다 play 같은 변수는 최대한 제거한다. 이런 임시 변수들 때문에 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 복잡해지기 때문이다.

이 방법은 **임시 변수를 질의 함수로 바꾸기** 기법을 사용해서 해결한다.

이렇게 지역 변수를 제거해서 얻는 가장 큰 장점은 함수 추출하기 작업이 훨씬 쉬워진다는 것이다.

이는 유효 범위를 신경 써야 할 대상이 줄어들기 때문이다.

이제 `statement()` 함수로 돌아가서 보자. `amountFor()` 함수로 thisAmount 변수를 대체할 수 있고 thisAmount 값이 이제 변하지 않으니 인라인 함수로 바꿀 수 있다.

그러므로 따라서 **변수 인라인하기**를 적용한다.

이제 변수가 많이 줄었다. 그러므로 적립 포인트 계산 부분을 추출하기가 더 쉬워졌다.

이제 처리해야 할 변수가 두 개 더 남아있다. performance를 간단히 전달만 하면 된다.

> playFor() 내부 메서드 (코드 5)

```ts
const statement = (invoice: any, plays: any) => {
  const amountFor = (performance: any) => {
    let result = 0;
    switch (playFor(performance).type) { // 질의 함수
      case 'tragedy': {
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      }
      case 'comedy': {
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${playFor(performance).type}`);
    }
    return result;
  };
  const playFor = (performance: any) => plays[performance.playID];
  // ...
  let volumeCredits: number = 0;
  // ...


  for (let perf of invoice.performances) {
    if (playFor(perf).type === 'comedy') { // 변수 인라인
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n`; // 변수 인라인
    totalAmount += amountFor(perf);
  }
  // ...
};
```

> volumeCreditsFor() 내부 메서드 (코드 6)

```ts
const statement = (invoice: any, plays: any) => {
  const amountFor = (performance: any) => {
    // ...
  };
  const playFor = (performance: any) => plays[performance.playID];
  const volumeCreditsFor = (performance: any) => {
    let result: number = Math.max(performance.audience - 30, 0);
    if (playFor(perf).type === 'comedy') { // 변수 인라인
      result += Math.floor(performance.audience / 5);
    }
    return result;
  };
  // ...
  let volumeCredits: number = 0;
  // ...

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(performance);

    result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n`; // 변수 인라인
    totalAmount += amountFor(perf);
  }
  // ...
};
```

### format 변수 제거하기

'format'은 이 함수가 하는 일을 충분히 설명해주지 못한다.

템플릿 문자열 안에서 사용될 이름이라 'formatAsUSD'라고 하기에는 또 너무 장황하다.

함수의 핵심은 화폐 단위 맞추기다.

이에 따라 느낌을 살리는 이름을 골라서 **함수 선언 바꾸기**를 적용했다.

> format() 내부 메서드 (코드 7)

```ts
const statement = (invoice: any, plays: any) => {
  const amountFor = (performance: any) => {
    // ...
  };
  const playFor = (performance: any) => plays[performance.playID];
  const volumeCreditsFor = (performance: any) => {
    // ..
  };
  const usd = (number: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number / 100);

  // ...
  let result: string;
  let volumeCredits: number = 0;
  // ...

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(performance);

    result += `  ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience}석)\n`; // 변수 인라인
    totalAmount += amountFor(perf);
  }
  result += `총액: ${usd(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
};
```

이름이 좋으면 함수 본문을 읽지 않고도 무슨 일을 하는지 알 수 있다.

처음에는 당장 떠오르는 최선의 이름을 사용하다가, 나중에 더 좋은 이름이 떠오를 때 바꾸는 식이 좋다.

흔히 코드를 두 번 이상 읽고 나서야 가장 적합한 이름이 떠오르곤 한다.

다음으로 totalAmount 도 앞에서와 똑같은 절차로 제거한다.

먼저 반복문을 쪼개고, 변수 초기화 문장을 옮긴 다음에 함수를 추출한다.

그 다음 인라인 함수로 만들면 된다.

### volumeCredits 변수 제거하기

**반복문 쪼개기**, **문장 슬라이드하기**(사용 하는 곳에 변수 선언을 가까이)를 적용해서 volumeCredits 변수를 선언하는 문장과 반복문을 모은다.

이처럼 한데 모아두면 **임시 변수를 질의 함수로 바꾸기**가 수월해진다.

함수 추출이 끝났다면, totalVolumeCredits() **변수를 인라인**한다.

> totalVolumeCredits() 내부 메소드 (코드 7)

```ts
export const statement = (invoice: any, plays: any) => {
  const amountFor = (performance: any) => {
    let result = 0;
    switch (playFor(performance).type) { // 질의 함수
      case 'tragedy': {
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      }
      case 'comedy': {
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${playFor(performance).type}`);
    }
    return result;
  };
  const playFor = (performance: any) => plays[performance.playID];
  const volumeCreditsFor = (performance: any) => {
    let result = Math.max(performance.audience - 30, 0);
    if ('comedy' === playFor(performance).type) {
      result += Math.floor(performance.audience / 5);
    }
    return result
  };
  const usd = (number: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number / 100);
  const totalVolumeCreditsFor = () => {
    let result: number = 0; // 기존의 volumeCredits 변수 선언 및 정의 문장 슬라이드 하기
    for (let perf of invoice.performances) {  // 반복문을 쪼개기
      result += volumeCreditsFor(perf);
    }
    return result
  }

  let totalAmount: number = 0;
  let result: string = `청구 내역 (고객명: ${invoice.customer})\n`;
  // ...

  for (let perf of invoice.performances) {
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${totalVolumeCreditsFor()}점\n`;
  return result;
};
```

여기서 잠시 멈추고 방금 한 일에 대해 생각해 보자.

반복문을 쪼개서 성능이 느려지지 않을까? 라는 걱정을 할 수 있다.

이처럼 반복문이 중복되는 것을 꺼리는 이들이 많지만, 이 정도 중복은 성능에 미치는 영향이 미비할때가 많다.

실제로 리팩터링 전과 후의 실행 시간을 측정해보면 차이를 거의 느끼지 못할 것이다.

그리고 똑똑한 컴파일러들은 최신 캐싱 기법을 무장하고 있어서 차이가 없도록 만들어 줄 것이다.

하지만 이처럼 리팩토링이 성능에 상당히 영향을 줄 수도 있다.

**그런 경우라도 나는 개의치 않고 리팩토링 한다. 잘 다듬어진 코드여야 성능의 개선 작업도 훨씬 수월하기 때문이다**

리팩터링 과정에서 성능이 크게 떨어졌다면 리팩토링 후에 시간을 내서 성능을 개선하면 된다.

리팩토링의 효과로 인해 더 깔끔하면서 더 빠른 코드를 얻을 확률이 높다.

**리팩토링 때문에 성능이 떨어졌다면 하던 리팩토링을 마무리하고 성능을 올리면 된다.**

또 하나, volumeCredits 변수를 제거하는 작업의 단계를 아주 잘게 나눴다는 점에도 주목하자.

1. **반복문 쪼개기**로 변수 값을 누적시키는 부분을 분리한다.
2. **문장 슬라이드하기**로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.
3. **함수 추출하기**로 적립 포인트 계산 부분을 별도 함수로 추출한다.
4. **변수 인라인하기**로 volumeCredits 변수를 제거한다.

항상 단계를 이처럼 잘게 나누는 것은 아니지만, 커밋을 잘게 나누어 위를 지키도록 노력해보자.

totalAmount도 똑같은 절차로 제거한다.

먼저 반복문을 쪼개고, 변수 초기화 문장을 옮긴 다음, 함수를 추출한다.

여기서 한 가지 문제가 있다. 추출할 함수의 이름으로는 'totalAmount'가 가장 좋지만, 이미 같은 이름의 변수가 있어서 쓸 수 없다.

그래서 일단 아무 이름의 'appleSauce'를 불여준다.

> appleSauce() 내부 메소드 (코드 8)

```ts
export const statement = (invoice: any, plays: any) => {
  const amountFor = (performance: any) => {
    let result = 0;
    switch (playFor(performance).type) { // 질의 함수
      case 'tragedy': {
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      }
      case 'comedy': {
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${playFor(performance).type}`);
    }
    return result;
  };
  const playFor = (performance: any) => plays[performance.playID];
  const volumeCreditsFor = (performance: any) => {
    let result = Math.max(performance.audience - 30, 0);
    if ('comedy' === playFor(performance).type) {
      result += Math.floor(performance.audience / 5);
    }
    return result
  };
  const usd = (number: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number / 100);
  const totalVolumeCreditsFor = () => {
    let result: number = 0; // 기존의 volumeCredits 변수 선언 및 정의 문장 슬라이드 하기
    for (let perf of invoice.performances) {  // 반복문을 쪼개기
      result += volumeCreditsFor(perf);
    }
    return result
  }
  const appleSauce = () => { // 함수 추출하기
    let result: number = 0; // 문장 슬라이딩
    for (let perf of invoice.performances) { // 반복문 쪼개기
      result += amountFor(perf);
    }
    return result;
  }
  
  let result: string = `청구 내역 (고객명: ${invoice.customer})\n`;
  // ...

  for (let perf of invoice.performances) {
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(appleSauce())}\n`; // 변수 인라인
  result += `적립 포인트: ${totalVolumeCreditsFor()}점\n`;
  return result;
};
```
