# 리팩터링: 첫 번째 예시

간단한 예시를 가지고 시작하겠다.

<br/>

## 1.1 자 시작해보자.

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

공연료 청구서를 출력하는 코드는 다음과 같이 간단히 `statement` 메서드(코드 3)로 구현했다.

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

<br/>

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

<br />

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

<br />

### volumeCredits 변수 제거하기

**반복문 쪼개기**, **문장 슬라이드하기**(사용 하는 곳에 변수 선언을 가까이)를 적용해서 volumeCredits 변수를 선언하는 문장과 반복문을 모은다.

이처럼 한데 모아두면 **임시 변수를 질의 함수로 바꾸기**가 수월해진다.

함수 추출이 끝났다면, totalVolumeCredits() **변수를 인라인**한다.

> totalVolumeCredits() 내부 메서드 (코드 7)

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
        return result;
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
        return result;
    };

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

> appleSauce() 내부 메서드 (코드 8)

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
        return result;
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
        return result;
    };
    const appleSauce = () => { // 함수 추출하기
        let result: number = 0; // 문장 슬라이딩
        for (let perf of invoice.performances) { // 반복문 쪼개기
            result += amountFor(perf);
        }
        return result;
    };

    let result: string = `청구 내역 (고객명: ${invoice.customer})\n`;
    for (let perf of invoice.performances) {
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(appleSauce())}\n`; // 변수 인라인
    result += `적립 포인트: ${totalVolumeCreditsFor()}점\n`;
    return result;
};
```

<br/>

## 1.5 중간 점검: 난무하는 중첩 함수

statement() 메서드의 경우 7줄 밖에 없다.

계산 로직은 모두 여러 개의 보조 함수로 추출했다.

결과적으로 각 계산 과정은 물론 전체 흐름을 이해하기가 훨씬 쉬어졌다.

<br/>

## 1.6 계산 단계와 포맷팅 단계 분리하기

지금까지는 프로그램의 논리적인 요소를 파악하기 쉽도록 코드의 구조를 나누고 보강하는데 주력으로 리팩토링했다.

이는 리팩토링 초기에 주로 수행하는 일이다.

복잡하게 얽힌 덩어리를 잘게 쪼개는 작업은 이름 짓기만큼이나 중요하다.

골격은 충분히 개선됐으니 이제 원하던 기능 변경, 즉 statement()의 HTML 버전을 만드는 작업을 살펴보자.

여러 각도에서 볼 때 확실히 처음 코드보다 작업하기 편해졌다.

계산 코드가 모두 분리됐기 때문에 일곱 줄짜리 최상단 코드에 대응하는 HTML 버전만 작성하면 된다.

현재 statement()메서드 안에는 텍스트 버전만 들어있다. 물론 이 코드를 그대로 복사해서 이용하면 htmlStatement()를 쉽게 만들 수 있다.

이 방법은 코드의 중복을 야기하므로 좋진 않다.

나는 텍스트 버전과 HTML 버전 함수 모두가 똑같은 계산 함수들을 사용하게 만들고 싶다.

다양한 해결책 중 내가 가장 선호하는 방식은 단계 쪼개기다.

(겹치는 부분과 다른 부분을 나누는 방식 같다. 다른 부분은 확장성을 고려한다.)

첫 단계에서는 statement()에 필요한 데이터를 처리하는 부분으로 하고

두 번째 단계에서는 앞서 처리한 결과를 텍스트나 HTML로 표현하도록 한다.

다시 말해서 첫 번째 단계에서는 두 번째 단계로 전달할 중간 데이터 구조를 생성하는 것이다.

단계를 쪼개려면 먼저 두 번째 단계가 될 코드들을 함수 추출하기로 뽑아내야 한다.

이 예에서는 두 번째 단계가 청구 내역을 출력하는 코드인데 현재까지 작성한 statement에서는 본문 전체가 해당한다.

중간 데이터 구조 역할을 할 객체를 만들어서 renderPlainText() 에 인수로 전달한다.

```ts
export const statement = (invoice: any, plays: any) => {
    const statementData = {
        customer: invoice.customer,
        performances: invoice.performances
    }
    return renderPlainText(statementData, plays);
}

export const renderPlainText = (data: any, plays: any) => {
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
    const totalVolumeCredits = () => {
        let result: number = 0; // 기존의 volumeCredits 변수 선언 및 정의 문장 슬라이드 하기
        for (let perf of data.performances) {  // 반복문을 쪼개기
            result += volumeCreditsFor(perf);
        }
        return result
    }
    const totalAmount = () => { // 함수 추출하기
        let result: number = 0; // 문장 슬라이딩
        for (let perf of data.performances) { // 반복문 쪼개기
            result += amountFor(perf);
        }
        return result;
    }

    let result: string = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(totalAmount())}\n`; // 변수 인라인
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;
    return result;
};
```

이제 renderPlainText에 전달되는 다른 두 인수 invoice와 plays의 데이터를 StatementData로 하나씩 옮겨보면 된다.

그러면 출력에 필요한 데이터는 모두 StatementData로 옮기게 되고 출력은 출력에만 집중하면 된다.

가장 먼저 고객 정보로부터 중간 데이터 구조로 옮겨보자.

같은 방식으로 공연 정보까지 중간 데이터 구조로 옮긴다면 invoice 객체는 이제 renderPlainText()에서 사라져도 된다.

추가적으로 'statement()에 필요한 데이터 처리'에 해당하는 코드를 모두 별도 함수로 빼낸다.

```ts
// createStatementData.ts
const createStatementData = (invoice: any, plays: any) => {
    const enrichPerformance = (performance: any) => {
        const result = {...performance};
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    };
    const playFor = (performance: any) => plays[performance.playID];
    const amountFor = (performance: any) => {
        let result = 0;
        switch (performance.play.type) { // 질의 함수
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
                throw new Error(`알 수 없는 장르: ${performance.play.type}`);
        }
        return result;
    };
    const volumeCreditsFor = (performance: any) => {
        let result = Math.max(performance.audience - 30, 0);
        if ('comedy' === performance.play.type) {
            result += Math.floor(performance.audience / 5);
        }
        return result;
    };

    const totalAmount = (enrichedPerformances: any) =>
        enrichedPerformances.reduce((total: number, p: any) => total + p.amount, 0);

    const totalVolumeCredits = (enrichedPerformances: any) =>
        enrichedPerformances.reduce((total: number, enrichedPerformance: any) => total + enrichedPerformance.volumeCredits, 0);

    const enrichedPerformances = invoice.performances.map(enrichPerformance);
    return {
        customer: invoice.customer,
        performances: enrichedPerformances,
        totalAmount: totalAmount(enrichedPerformances),
        totalVolumeCredits: totalVolumeCredits(enrichedPerformances)
    };
};

export default createStatementData;
```

```ts
// statement.ts
import createStatementData from './create.statement.data';

export const statement = (invoice: any, plays: any) => {
    return renderPlanText(createStatementData(invoice, plays));
};

const renderPlanText = (data: any) => {
    let result: string = `청구 내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(data.totalAmount)}\n`; // 변수 인라인
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    return result;
};

const usd = (number: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
}).format(number / 100);
```

마지막으로 드디어 HTML 버전을 작성할 준비가 끝난다.

```ts
// statement.ts
import createStatementData from './create.statement.data';

export const htmlStatement = (invoice: any, plays: any) => {
    return renderHtml(createStatementData(invoice, plays));
};

const renderHtml = (data: any) => {
    let result: string = `
<h1>청구 내역 (고객명: ${data.customer})</h1>
<table>
  <tr><th>연극</th><th>좌석수</th><th>금액</th></tr>
`;
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td><td>${usd(perf.amount)}</td></tr>`;
    }
    result += `</table>
<p>총액: <em>${usd(data.totalAmount)}</em></p>
<p>적립 포인트: <em>${data.totalVolumeCredits}점</em></p>
`;
    return result;
};
```

<br/>

## 1.7 중간 점검: 두 파일(과 두 단계)로 분리됨

처음보다 코드량이 부쩍 늘었다. 추가된 코드 덕분에 전체 로직을 구성하는 요소 각각이 더 뚜렷이 부각되고,

계산하는 부분과 출력 형식을 다루는 부분이 분리됐다.

이렇게 묘듈화하면 각 부분이 하는 일과 그 부분들이 맞물려 돌아가는 과정을 파악하기 쉬워진다.

프로그래밍에서만큼은 명료함이 진화할 수 있는 소프트웨어의 정수다.

모듈화한 덕분에 계산 코드를 중복하지 않고도 HTML 버전을 만들 수 있었다.

`항시 코드 베이스를 작업 시작 전보다 건강하게 만들어놓고 떠나야 한다.`

<br />

## 1.8 다형성을 활용해 계산 코드 재구성하기

이번에는 연극 장르를 추가하고 장르마다 공연료와 적립 포인트 계산법을 다르게 저장하도록 기능을 수정해 보자.

현재 상태에서 코드를 변경하려면 이 계산을 수행하는 함수에서 조건문을 수정해야 한다.

amountFor메서드를 보면 연극 장르에 따라 계산 방법이 달라진다는 사실을 알 수 있는데,

이런 형태의 조건부 로직은 코드 수정 횟수가 늘어날수록 골칫거리고, 전락하기 쉽다.

이를 방지하려면 프로그래밍 언어가 제공하는 구조적인 요소로 보완해야 한다.

조건부 로직을 명확한 구조로 보완하는 방법은 다양하다.

여기서는 객체지향 핵심 특성인 다형성을 활용하도록 하겠다.

이번 작업의 목표는 상속 계층을 구성해서 희극 서브 클래스와 비극 서브 클래스가 각자의 구체적인 계산 로직을 정의하도록 해서 해결하겠다.

희극이나 비극이냐에 따라 정확한 계산 로직을 연결하는 작업은 언어 차원에서 지원받도록 한다.

적립 포인트도 비슷한 구조로 만들 것이다. 이 과정에서 몇 가지 리팩토링 기법을 사용하는데, 그중 핵심은 조건부 로직을 다형성으로 바꾸는 것이다.

이 리팩토링 기법을 사용하려면 상속 계층부터 정의해야 한다. 즉 공연료와 적립 포인트 계산 함수를 담을 클래스가 필요하다.

<br/>

### 공연료 계산기 만들기

여기서는 공연료를 계산하는 amountFor() 함수를 공연마다 자기가 공연료를 계산하는 PerformanceCalculator를 만들어서 거기에 옮기는 작업부터 하겠다.

조건마다 구현이 약간씩 다른 경우에 클래스와 상속을 이용한 코드로 리팩토링을 진행하자.

여기서는 함수를 클래스로 옮기는 함수 옮기기 기법을 사용한다.

```ts
class PerformanceCalculator {
    private readonly _performance: any;
    private readonly _play: any;

    constructor(performance: any, play: any) {
        this._performance = performance;
        this._play = play;
    }

    public get amount(): number {
        let result: number = 0;
        switch (this._play.type) {
            case 'tragedy': {
                result = 40000;
                if (this._performance.audience > 30) {
                    result += 1000 * (this._performance.audience - 30);
                }
                break;
            }
            case 'comedy': {
                result = 30000;
                if (this._performance.audience > 20) {
                    result += 10000 + 500 * (this._performance.audience - 20);
                }
                result += 300 * this._performance.audience;
                break;
            }
            default:
                throw new Error(`알 수 없는 장르: ${this._play.type}`);
        }
        return result;
    }
}
```

그 다음 적립 포인트를 계산하는 volumeCreditFor 메소드도 PerformanceCalculator 클래스로 옮긴다.

<br/>

### 추가적으로 공연료 계산기 다향성 버전으로 만들기

먼저 타입 코드 대신 서브클래스를 사용하도록 변경해야 한다. 이는 **타입 코드를 서브 클래스로 바꾸기** 기법이 사용한다.

이렇게 하려면 PerformanceCalculator의 서브 클래스들을 준비하고 그 중에서 적합한 서브 클래스를 사용하게 만들어야 한다.

이를 위해 PlayType 에 맞게 적절한 Calculator를 생성해주는 createPerformanceCalculator를 만들고 이를 사용하도록 했다.

> calculatorFactory.ts

```ts
export const createPerformanceCalculator = (performance: any, play: any) => {
    switch (play.type) {
        case 'tragedy':
            return new TragedyCalculator(performance, play);
        case 'comedy':
            return new ComedyCalculator(performance, play);
        default:
            return new PerformanceCalculator(performance, play);
    }
};

export class PerformanceCalculator {
    private _performance: any;
    private _play: any;

    constructor(performance: any, play: any) {
        this._performance = performance;
        this._play = play;
    }

    public get performance(): any {
        return this._performance;
    }

    public get play(): any {
        return this._play;
    }

    public get amount(): number {
        throw new Error('서브클래스 전용 메서드입니다.');
    }

    public get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    public get amount(): number {
        let result: number = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}


class ComedyCalculator extends PerformanceCalculator {
    public get amount(): number {
        let result: number = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    public get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

```

> createStatementData.ts

```ts
import { createPerformanceCalculator, PerformanceCalculator } from './calculator/calculator.factory';

const createStatementData = (invoice: any, plays: any) => {
    const playFor = (performance: any) => plays[performance.playID];
    const totalAmount = (performances: any) => performances.reduce((total: number, p: any) => total + p.amount, 0);
    const totalVolumeCredits = (performances: any) => performances.reduce((total: number, p: any) => total + p.volumeCredits, 0);

    const enrichPerformance = (performance: any) => {
        const calculator: PerformanceCalculator = createPerformanceCalculator(performance, playFor(performance));
        const result = {...performance};
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    };
    const enrichPerformances = invoice.performances.map(enrichPerformance);
    return {
        customer: invoice.customer,
        performances: enrichPerformances,
        totalAmount: totalAmount(enrichPerformances),
        totalVolumeCredits: totalVolumeCredits(enrichPerformances)
    };
};

export default createStatementData;
```

<br />

## 1.10 마치며

간단한 예였지만 리팩토링이 무엇인지 감을 잡았길 바란다.

**함수 추출하기**

**변수 인라인하기**

**함수 옮기기**

**조건부 로직을 다형성으로 바꾸기**를 비롯한 다양한 리팩토링 기법을 선보였다.

먼저 원본 함수를 중첩 함수 여러 개로 나눴다. (코드 구조를 분리한 단계로 가장 기본적인 단계의 리팩토링을 말한다.)

다음으로 **단계 쪼개기**(출력에 필요한 데이터 생성, 출력 메서드 쪼개기) 를 사용해서 각 기능별로 모듈화해서 중복을 제거했다.

마지막으로 계산 로직을 다형성으로 표시했다. 각 단계에서 코드 구조를 보강했고 코드가 무슨 일을 하는지보다 더 명확해졌다.

**좋은 코드를 가늠하는 확실한 방법은 '얼마나 수정하기 쉬운가?'이다.**

이 책은 코드를 개선하는 방법을 다룬다.

그런데 프로그래머 사이에서 어떤 코드가 좋은 코드인가에 대한 의견은 분분하다.

내가 선호하는 **적절한 이름의 작은 함수들**로 만드는 방식에 대해 반대하는 사람도 분명히 있을 것이다.

미적인 관점으로 접근하면 좋고 나쁨을 넘어서 명확하지 않다. 어떠한 지침도 세울 수 없다.

하지만 '수정하기 쉬운 코드'는 분명히 좋은 코드의 관점을 제공해 준다.

코드는 명확해야 한다. 코드를 수정해야 할 상황이 오면 고쳐야 할 곳을 쉽게 찾을 수 있고 오류 없이 빠르게 수정할 수 있어야 한다.

건강한 코드 베이스는 생산성을 극대화하고, 고객에게 필요한 기능을 더 빠르게 저렴한 비용으로 제공하도록 해준다.

이번 예시를 통해 배울 수 있는 가장 중요한 것은 바로 리팩토링의 리듬이다.

사람들에게 내가 리팩토링하는 과정을 보여줄 때마다 각 단계를 굉장히 잘게 나누고 매번 컴파일하고 테스트하여 작동하는 상태로 유지한다는 사실에 놀란다.

리팩토링을 효과적으로 하는 핵심은, 단계를 잘게 나눠야 더 빠르게 처리할 수 있고, 코드는 절대 깨지지 않으며 이러한 작은 단계들이 모여서 상당히 큰 변화를 이룰 수 있다는 사실을 깨닫는 것이다.
