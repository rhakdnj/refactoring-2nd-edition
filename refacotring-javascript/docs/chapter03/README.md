# 코드에서 나는 악취
리팩토링이 필요한 코드들은 일정한 패턴이 있다는 사실을 발견했다.

<br/>

## 3.1 기이한 이름(Mysterious Name)
추리 소설이라면 무슨 일이 전개되는지 궁금할 수 있지만 코드에선 아니다.

코드는 단순하고 명료해야 한다. **코드를 명료하게 표현하는 데 크게 기여하는 것 중 하나는 이름이다.**

그래서 함수, 모듈, 변수, 클래스 이름만 보고도 무슨 일을 하는지 어떻게 사용하는지를 명확히 알 수 있어야 한다.

하지만 이름 짓기는 프로그래밍에서 가장 어렵다고 알려진 두 가지 방법의 하나다.(나머지 하나는 캐시 무효화다)

그 때문에 우리가 자주 사용하는 리팩토링도 함수 선언 바꾸기(6.5절), 변수 이름 바꾸기(6.7절), 필드 이름 바꾸기(9.2절) 같은 리팩터링들이다.

이름 바꾸기는 단순히 표현을 위한 방법이 아니다. **이름은 명확하게 무엇인지 드러내는 것으로 명확한 이름이 떠오르지 않는다면 설계가 잘못된 것일 수도 있다.**

<br/>

## 3.2 중복 코드(Duplicated Code)
똑같은 코드 구조가 여러 곳에서 반복된다면 하나로 통합해서 더 나은 프로그램으로 변경할 수 있다.

중복 코드를 해결할 땐 서로 차이점이 없는지 살펴보는 게 중요하다.

가장 간단한 코드 중복의 예로 하나의 클래스 안에서 두 메서드가 똑같은 표현을 한다면 함수 추출하기(6.1절)을 적용할 수 있다.

코드가 비슷한데 완전 똑같지는 않다면 문장 슬라이스(8.6절)로 비슷한 부분을 모으고 함수 추출하기(6.1절)로 빼낼 수 있다.

같은 부모로부터 파생된 서브 클래스에서 중복된 방법이 있다면 각자 따로 만드는 게 아니라 부모의 방법을 통해서 호출하도록 하는 메서드 올리기(12.1절) 방법도 있다.

<br/>

## 3.3 긴 함수
짧은 함수들로 구성된 코드 베이스를 훑어보면 **자기가 계산하는 구조보다 위임하는 구조로 보인다.**

짧은 함수로 만든다는 건 하나의 긴 함수처럼 모든 계산을 하는 것이 아니라 짧은 함수 여러 개를 호출하는 구조이다.

그리고 **짧은 함수와 좋은 이름의 조합**은 짧은 함수의 구현을 보지 않아도 어떠한 일을 하는지 명확하게 알 수 있어서 코드를 이해하기가 훨씬 쉬워진다.

우리는 주석으로 달아야 하는 부분이 있다면 무조건 함수로 만든다.

주석의 역할을 함수의 이름으로, 즉 함수 이름을 통해 동작 방식에 집중하지 말고 의도에 집중하자.

즉 **무엇을 하는지 설명해 주지 못한다면 함수의 이름을 잘 지은 게 아니다.**

함수를 짧게 만드는 방법의 99%는 **함수 추출하기(6.1절)로 이뤄진다.**

**함수가 매개변수와 임시 변수를 많이 사용한다면 추출하기 어렵다.(단일 책임 원칙을 위반했을 확률이 높다.)**

많은 임시 변수는 **임시 변수를 질의 함수로 바꾸기(7.4절)으로 임시 변수의 수를, 매개변수 객체 만들기(6.8절)와 객체 통째로 떠넘기기(11.4절)로는 매개변수의 수를 줄일 수 있다.**

이런 리팩토링 기법을 적용해도 여전히 임시 변수와 매개 변수가 많다면 **함수를 명령으로 만들기(11.9절) 기법을 사용해도 좋다.**

조건문이나 반복문도 추출의 대상이 된다.

**조건문 분해하기(10.1절)로 대응하거나 switch 문을 구성하는 case문마다 있는 내용을 함수로 추출하는 함수 추출하기(6.1절)를 적용해서 각 case의 본문을 함수 호출문 하나로 바꾼다.**

같은 조건을 기준으로 나뉘는 switch 문이 여러 개라면 ****조건문을 다형성으로 바꾸기(10.4절)를 적용하면 된다.**

반복문도 그 안의 코드와 함께 추출해서 함수로 만드는 것도 가능하다.

**추출한 반복문에 마땅한 이름이 떠오르지 않는다면 성격이 다른 두 가지의 일을 하는 것일 수도 있다.**

이는 반복문 쪼개기(8.7절)를 사용하자.


<br/>

## 3.4 긴 매개변수 (Long parameters)
매개변수의 목록이 길어지면 그 자체로 이해하기 어렵다.

종종 다른 매개변수에서 값을 얻어올 수 있는 매개변수가 있다면 이런 매개변수는 **매개 변수를 질의 함수로 바꾸기(11.5절)를 적용할 수 있다.**

사용 중인 데이터 구조에서 값들을 각각 뽑아서 매개변수로 넘기는 구조라면 **객체 통째로 넘기기(11.4절)를 적용할 수 있다.**

항상 함께 전달되는 매개변수들이 있다면 이들을 묶는 방법인 매개변수 객체로 만들기(6.8절)를 적용할 수 있다.

함수의 동작을 제어하는 플래그 역할을 하는 매개변수는 **플래그 인수 제거하기(11.3절)로 없애 줄 수 있다.**

클래스를 통해서 매개변수를 줄일 수 있다.

만약에 여러 함수가 특정 매개변수들의 값을 공통으로 사용할 때, 이를 하나의 클래스 안으로 옮기면 파라미터 자체를 많이 줄일 수 있다.

이 기법은 여러 함수를 클래스로 묶기(6.9절)기법을 통해서 가능하다.

**즉, 특정 매개변수들의 값을 클래스의 필드로 정의한다.**

<br/>

## 3.5 전역 데이터
전역 데이터는 변경을 하지 못하도록하자.

변경이 되는 데이터면 전역적으로 사용하는 것을 지양하자.

우리가 사용하는 대표적인 리팩터링은 **변수 캡슐화하기(6.6절) 이다.**

이를 통해 접근 포인트를 제어할 수 있다.


<br/>

## 3.6 가변 데이터
데이터를 변경했더니 예상치 못한 결과로 이어지는 경우가 종종 있다.

이런 문제는 아주 드물게 발생하지만 만약에 발생한다면 이를 찾기는 굉장히 어렵다.

이러한 이유로 함수형 프로그래밍에서는 데이터를 변경하지 않고 변경하는 경우라면 원래의 데이터의 복제본을 만들어서 사용하는 경우가 많다.

하지만 함수형 프로그래밍 자체를 사용하는 경우도 적고 변수 바꾸기를 지원하는 언어는 많다.

그렇다고 해서 불변성이 주는 장점을 포기할 필요는 없고 불변성을 주는 방법은 다양하게 있다.

가령 변수 캡슐화하기(6.6절)를 통해서 정해놓은 함수를 거쳐서만 변수에 접근할 수 있도록 하는 방법이 있다.

이를 통해 변수의 수정 포인트를 제한할 수 있고 수정되는 과정을 디버깅 하기도 쉽다.

하나의 번수에 용도가 다른 값들을 매번 갱신하는 경우가 있다면 변수 쪼개기(9.1절)를 통해서 독립된 변수로 만들어서 갱신되는 변수만 따로 고립시켜 놓는 방법도 있다.

그리고 갱신 로직 자체를 별도의 다른 방법으로 빼내서 코드를 분리하는 기법도 있다.

이는 함수 추출하기(6.1절)와 문장 얇게 썰기(8.6절)기법을 통해서 가능하다.

**API를 만들 때는 질의 함수와 변경 함수 분리하기(11.1절)를 구별시켜 놓는 게 좋다. (CQRS 패턴)**

그리고 **세터 제거하기(11.7절)를** 통해서 애초에 변경될 여지를 막아놓는 것도 좋다.

값을 다른 곳에서 설정할 수 있는 가변 데이터가 풍기는 악취는 고약하다.

변수를 바꿀 수 있는 범위가 넓어질수록 위험도 덩달아 커진다.

**따라서 여러 함수를 클래스로 묶기(6.9절) 나, 여러 함수를 변환 함수로 묶기(6.10 절)를 활용해서 특정 변수를 갱신하는 코드를 제한시켜 놓는 게 좋다.**

구조체처럼 내부 필드에 데이터를 담고 있는 구조라면 일반적으로 **참조를 값으로 바꾸기(9.4절)를 적용해 내부 필드를 수정하지 말고 구조체를 통째로 교체(return new 새로운 객체)하는 편이 좋다.**

<br/>

## 3.7 뒤엉킨 변경 (Divergent Change)
이 말은 변경 포인트를 한 군데로 고립시킨다는 말을 뜻한다.

이렇게 할 수 없다면 뒤엉킨 변경과 산탄총 수술 중 하나 때문에 그렇다.

**뒤엉킨 변경은 단일 책임 원칙(SRP)이 제대로 지켜지지 않을 때 발생하는 원칙이다.**

즉 하나의 모듈이 여러 가지 원인 때문에 변경될 때를 말한다.

예컨대 하나의 기능을 지원하기 위해 고쳐야 하는 메소드가 여러 군데라면 이는 뒤엉킨 변경이 발생한 것이다.

예를 들어 새로운 데이터베이스를 지원하려고 하는데 함수 세 개를 바꿔야 하고, 금융상품이 하나씩 추가될 때마다 또 다른 함수 네 개를 바꿔야 한다면 이는 뒤엉킨 변경이 발생한 것이다.

데이터베이스 연동과 금융 상품 처리는 다른 맥락에서 이뤄지므로 독립된 모듈로 분리되어 있어야 한다.

그래야 무언가를 수정할 때 해당 맥락의 코드만 봐도 진행하는 게 가능하다.

데이터베이스에서 데이터를 가져오고 금융 상품에서 처리하는 구조로 맥락이 잡혀 있다면 이렇게 맥락을 분리하기 위해서 단계를 분리하는 단계 쪼개기(6.11절)기법을 적용하는 게 좋다.

전체 처리 과정에서 각기 다른 맥락의 함수를 호출하고 있다면 맥락을 가진 모듈을 만들어 주고 관련 함수들을 모으는 **함수 옮기기(8.1절) 기법을 사용하는 게 좋다.**

**이때 여러 맥락을 드나드는 함수가 있다면 이를 분리하기 위해 함수 추출하기(6.1절) 기법을 사용한다.**

**모듈이 클래스 단위라면 클래스 추출하기(7.5절) 기법이 맥락별로 분리하는 데 기여해 줄 것이다.**

<br/>

## 3.8 산탄총 수술 (Shotgun Surgery)
산탄총 수술은 흩어진 맥락을 모으는 용도. 뒤엉킨 변경은 하나의 거대한 맥락을 작은 맥락으로 나누는 용도이다.

이 냄새는 코드를 변경할 때마다 자잘하게 수정해야 하는 클래스가 많을 때 풍긴다.

변경할 부분이 코드 전반에 흩어져 있다면 찾기가 어렵다. 그리고 수정할 부분을 놓치기 쉽다.

이럴 때는 함께 변경되는 대상들을 **함수 옮기기(8.1절)와 필드 옮기기(8.2절)로 모두 한 모듈로 묶어두는 게 좋다.**

**비슷한 데이터를 다루는 함수가 많다면 여러 함수를 클래스로 묶기(6.9절)** 기법을 통해서 모듈로 만들 수 있다.

**구조를 변환하거나 보강(enrich)하는 함수들이 많다면 여러 함수를 변환 함수로 묶기(6.10절)를 적용하면 된다.**

**이렇게 묶은 함수들을 다음 단계로 전달하는 구조라면 단계 쪼개기(6.11절)를 적용하면 된다.**

어설프게 분리된 로직을 **함수 인라인 하기(6.2절)** 나 **클래스 인라인 하기(7.6절)** 와 같은 리팩토링 기법을 적용하는 것도 좋다.

<br/>

### 뒤어킹 변경, 산탄총 수술 비교
|           | 뒤엉킨 변경        | 산탄총 수술        |
|-----------|---------------|---------------|
| 원인        | 맥락을 잘 구분하지 못함 | 맥락을 잘 구분하지 못함 |
| 해법(원리)    | 맥락을 명확히 구분    | 맥락을 명확히 구분    |
| 발생 과정(현상) | 한 코드에 섞여 들어감  | 여러 코드에 흩뿌려짐   |
| 해범(실제 행동) | 맥락별로 분리       | 맥락별로 모음       |

<br/>

## 3.9 기능 편애
**프로그램을 모듈화 할 때 고려해야 하는 사항으로는 같은 모듈에서는 상호작용을 최대한 늘리고 모듈과 다른 모듈 사이의 상호 작용은 최대한 줄여야 한다.**

기능 편애는 흔히 어떤 모듈의 함수가 자신이 속한 모듈의 함수나 데이터와의 상호 작용보다 다른 모듈과의 상호작용이 더 많을 때 풍기는 냄새다.

흔히 Getter 메소드를 여러 번 호출하면서 다른 데이터에 접근해서 상호작용할 때 풍기는 냄새로 해결하기는 쉽다.

그 데이터 근처로 함수를 추출해서 옮겨주면 된다.

때로는 함수 안에서 함수의 일부가 다른 모듈의 기능을 편애할 수 있다. 그런 경우도 마찬가지로 **함수를 추출하기(6.1절)** 를 통해 옮겨주면 된다.

어디로 옮겨야 할 지 명확하지 않은 경우가 있는데 이 경우에는 관련 데이터가 가장 많은 모듈로 옮기는 게 적합하다. 이는 **함수 옮기기 (8.1절)** 를 이용하면 된다.

한편 앞의 두 문단에서 설명한 규칙을 거스르는 패턴이 있는데 전략 패턴(Strategy Pattern)과 방문자 패턴(Visitor Pattern)이 그 상황에 해당한다.

켄트 백의 자기 위임(Self Delegation)도 여기에 속한다. 

이들이 활용되는 이유로는 뒤엉킨 변경 냄새를 해결하기 위해 이런 것으로 함께 변경할 대상들을 모으는 용도로 사용했기 때문에 기능 편애가 일어난 것이다.

데이터와 이를 활용하는 동작은 원래 한 곳에 있어야 맞지만 항상 예외는 있다.

그럴 때는 같은 데이터를 다루는 로직은 한곳으로 모으는 게 좋다.

전략 패턴과 방문자 패턴을 이용하면 오버라이딩 해야하는 특정 동작을 각각 클래스로 격리해 주므로 수정하기가 쉬워진다.

<br/>

## 3.10 데이터 뭉치 (Data Clumps)
데이터는 하나의 단위로 같이 움직여서 전달되는 책임이 있다.

클래스의 특정 필드끼리 몰려다닌다면 **클래스 추출 하기 기법(7.5절)로** 하나의 객체로 묶는다.

메소드의 파라미터 끼리 몰려다닌다면 **매개변수 객체 만들기(6.8절)나** **객체 통째로 넘기기(11.4절)를** 적용해서 매개 변수 수를 줄여본다.

데이터 뭉치인지 확인하기 위해서는 값 하나를 지워본다고 가정해보자. 그랬을 때 나머지의 값들이 의미가 없다면 이들은 뭉쳐다니는 것이다.

이러한 연계 과정은 종종 상당한 중복을 없애고 유용한 클래스를 탄생시키는 결과로 이어지기도 한다.

데이터 뭉치가 생산성에 기여하는 정식 멤버로 등극하는 순간이다.

<br/>

## 3.11 기본형 집착(Primitive Obsession)
대부분의 프로그래밍 언어에서는 정수, 부동소수점 수, 문자열과 같은 다양한 기본형을 제공한다.

한편 프로그래머 중에는 자신에게 주어진 문제에 딱 맞는 기초 타입(화폐, 좌표, 구간 등)을 직접 정의하기를 몹시 꺼리는 사람이 많다.

그래서 금액을 그냥 숫자형으로 계산하거나, 물리량을 계산할 때도 밀리미터나 인치 같은 단위를 무시하고, 범위도 `if (a < upper && a > lower)`처럼 처리하는 코드를 수없이 봤다.

이 냄새는 특히 문자열 변수에서 특히 심한데 전화번호를 단순 문자열 표현이라고만 생각하는 경우가 많다.

전화번호가 제공해 주는 기능이 꽤 있는데도 말이다.

그래서 이런 기본형을 객체로 바꿔주는 작업으로 문명사회로 이끌어줘야 한다. 

그리고 기본형을 클래스로 감싸면 validate 작업을 추가로 넣을 수 있다는 이점이 있다.

기본형으로 표현된 코드가 조건부 동작을 제어하는 타입 코드로 쓰였다면 **타입 코드를 서브 클래스로 바꾸기(12.6절)와** **조건부 로직을 다형성으로 바꾸기(10.4절)를** 차례로 적용한다.


<br/>

## 3.12 반복되는 switch문
switch문을 보면 **조건부 로직을 다형성으로 바꾸기(10.4절)로** 없애야 할 대상이라고 주장한다.

switch문이 진짜 나쁜 상황은 중복해서 사용하고 있을 경우다.

이 경우에 하나의 케이스가 추가되기만 하면 모든 switch문을 찾아서 넣어줘야 하는 작업이 필요해진다.

이렇게 중복이 발생하고 있다면 조건부 로직을 다형성으로 바꿔주자.

<br/>

## 3.13 반복문
예전에는 반복문의 대안이 없었지만 현재는 일급 함수(First-class Function)를 지원하는 프로그래밍 언어가 많아지면서 

반복문을 **파이프라인으로 바꾸기(8.8절)** 를 적용해서 시대에 맞지 않는 반복문을 제거하는 게 가능해졌다.

Filter나 Map같은 파이프라인 연산을 사용하면 원소들이 어떻게 처리되는지 쉽게 파악할 수 있다. 

<br/>

## 3.14 성의 없는 요소(Lazy Element)
우리는 코드의 구조를 잡을 때 프로그래밍 요소를 활용한다. (요소는 클래스, 메소드, 인터페이스 등 코드 구조를 잡는 데 활용되는 요소를 뜻한다.)

이렇게 프로그래밍적 요소를 활용하면 재활용할 수 있는 여건과 함께 의미 있는 이름을 가질 수 있기 때문이다.

그렇지만 그 구조가 필요 없을 때도 있다. 

재활용의 여지가 없는 메소드, 이름을 가지지 않아도 충분히 이해할 만한 동작들..

이런 경우에 구조를 분해해서 없애버리는 게 좋다. 그 기법으로는 함수를 **인라인하기 기법(6.2절)나 클래스 인라인 하기(7.6절)로** 처리한다.

상속을 사용했다면 **계층 합치기(12.9절)를** 이용하는 게 좋다.

<br/>

### 3.15 추측성 일반화 (Speculative Generality)
추측성 일반화는 나중에 이게 필요할 것이라는 이유로 당장은 필요 없는 코드로 인해 풍기는 악취다.

당장 걸리적거리는 코드는 모두 지워버리자.

하는 일이 거의 없는 추상 클래스는 **계층 합치기** (12.9절)로 제거하고 쓸데없이 위임하는 코드는 **함수 인라인 하기** (6.2절)과 **클래스 인라인 하기** (7.6절)로 삭제하자.

본문에서 사용하지 않는 매개변수는 **함수 선언 바꾸기** (6.5절)로 제거하자.

추측성 일반화는 주로 테스트 코드 말고는 사용하는 경우가 없는데 이런 경우에는 테스트 케이스부터 삭제한 다음 **죽은 코드 제거하기** (8.9절)로 날려버리자.

<br/>

### 3.16 임시 필드 (Temporary Field)
간혹 특정 상황에서만 값이 설정되는 필드를 가진 클래스도 있다.

이 때 객체를 가져올 때는 당연히 모든 필드가 채워져 있으리라 기대하는 게 보통이라, 이렇게 임시 필드를 갖도록 작성 코드를 이해하기 어렵다.

그래서 사용자는 쓰이지 않는 것처럼 보이는 필드가 존재하는 이유를 파악하느라 머리를 싸매게 된다.

임시 필드가 있다면 이런 필드만 따로 뽑는 **클래스 추출하기** (7.5절)로 제 살 곳을 찾아줘야 한다.

그런 다음 **함수 옮기기** (8.1절) 기법으로 임시 필드와 관련 있는 함수들을 모두 새 클래스에 몰아넣는다.

또한, 임시 필드들이 유효한지를 확인하 후 동작하는 조건부 로직이 있을 수 있는데, **특이한 케이스 추가하기** (10.5절)로 필드들이 유효하지 않을 때를 위한 대안 클래스를 만들어서 제거할 수 있다.

<br/>

### 3.17 메시지 체인 (Message Chain)
메시지 체인은 클라이언트가 한 객체를 통해 다른 객체를 얻은 뒤 방금 얻은 객체에 또 다른 객체를 요청하는 식으로,

다른 객체를 요청하는 작업이 연쇄적으로 이어지는 코드를 말한다.

가령 getSomething() 같은 게터가 연속적으로 호출해서 객체를 찾아나가는 걸 말한다.

이는 클라이언트가 객체 내비게이션 구조에 종속됐음을 말한다. 내비게이션 중간 단계를 수정하면 클라이언트 코드도 수정해야 한다.

이 문제는 위임 숨기기 (7.7절)로 해결한다. 이 리팩터링은 메시지 체인의 다양한 연결점에 적용할 수 있다.

원칙적으로 체인을 구성하는 모든 객체에 적용할 수 있지만, 그러다 보면 중간 객체들이 모두 중개자가 돼버리기 쉽다.

그러니 최종 결과 객체가 어떻게 쓰이는지부터 살펴보는게 좋다. **함수 추출하기** (6.1절)로 결과 객체를 사용하는 코드 일부를 따로 빼낸 다음 **함수 올기기** (8.1절)로 **체인을 숨길 수 있는지 살펴보자.**

> 예시
```ts
let managerName: string = person.department.manager.name;

managerName = person.department.managerName; // 관리자 객체(manager)의 존재를 숨김
managerName = person.department.managerName; // 부서 객체(department)의 존재를 숨김
managerName = person.managerName; // 부서 객체와 관리자 객체 모두의 존재를 숨김

// 개선 예시
managerName = person.department.manager.name;
const report = `${managerName}께
${person.name} 님의 작업 로그
...
`;
console.log(report);

// 여기서 보고서 생성 로직을 함수로 추출한 다음 모듈로 옮기면 체인의 존재가 감춰진다.
console.log(reportAutoGenerator.repot(person));

// 마지막으로 체인의 중간인 부서 정보를 얻어 사용하는 다수의 클라이언트가 부서장 이름도 함께 사용한다면
// 부서 클래스에 managerName() 메서드를 추가하여 추가하여 체인을 단축할 수 있다.
```

<br/>

## 3.18 중개자 (Middle Man)
객체의 대표적인 기능 중 하나로 캡슐화(encapsulation)가 있다.

캡슐화하는 과정에서는 위임(delegation)이 자주 활용된다.

예로 팀장과 미팅을 잡는다고 하면 팀장은 자신의 일정을 확인한 후 답을 준다.

근데 일정을 잡는 과정에서 다이어리를 쓰든, 캘린더를 쓰든, 비서를 쓰든 그건 알 바 아니다.

캡슐화는 대상의 구현을 몰라도 원하는 바를 얻을 수 있는 장점이 있다.

그치만이 지나치면 문제가 되는데 클래스의 메소드의 절반이 다른 객체에 위임하고 있는 구조라면  중개자 제거하기 (7.8절)를 활용하여 실제로 일을 하는 객체와 직접 소통하게 하자.

<br/>

## 3.19 내부자 거래 (Insider Trading)
소프트웨어 개발자는 모듈 사이에 벽을 두껍게 세우기를 좋아한다.

취지는 모듈은 응집성을 높이고 결합도를 낮춘다.

만약에 은밀하게 모듈끼리 데이터를 주고받는 일이 있다면 **함수 옮기기** (8.1절)와 **필드 옮기기** (8.2절)기법으로 떼어놓아서 결합을 줄이는 게 좋다.

여러 모듈이 같은 관심사를 공유해서 결합하는 일이 많다면 제 3의 모듈을 만드는 기법이나 **위임 숨기기** (7.7절)를 이용하여 다른 모듈이 중간자의 역할을 하게 한다.

상속 구조에서 부모와 자식 클래스 간의 결합이 많아진다고 하면 헤어져야 한다.

자식 클래스는 항상 부모 클래스가 공개하고 싶은 것 이상으로 부모에 대해 알려고 한다.

그러다가 분리를 해야할 시점이 오면 **서브 클래스를 위임으로 바꾸기** (12.10절)나 **부모 클래스를 위임으로 바꾸기** (12.11절)를 이용하자.

<br/>

## 3.20 거대한 클래스 (Large Class)
한 클래스가 너무 많은 일을 하려다 보면 필드 수가 늘어난다.

필드 수가 많아지면 필드의 이해가 떨어져서 중복 코드가 발생할 확률이 높아진다.

이럴 땐 **클래스 추출하기** (7.5절)로 관련 있는 필드끼리 묶는다.

주로 접두어, 접미어가 같은 필드끼리 묶어서 클래스로 만든다고 생각하면 된다.

이렇게 클래스로 추출할 일이 있을 수 있고 상속 관계로 만드는 게 나을 수도 있다. 

이 경우에는 **슈퍼 클래스 추출하기** (12.8절)나 **타입 코드를 서브 클래스로 바꾸기** (12.6절)를 적용한다.

목표는 클래스가 항시 모든 필드를 사용하도록 하자.

<br/>

## 3.21 서로 다른 인터페이스의 대안 클래스들 (Alternative Classes with Different Interfaces)
클래스의 장점은 언제든 필요에 따라 클래스를 교체할 수 있다는 것이다.

이를 위해서는 클래스의 타입이 인터페이스와 같아야 한다.

따라서 인터페이스에서 선언한 메소드와 같아지도록 **함수 선언 바꾸기** (6.5절)로 메소드 시그니처를 일치시킨다. 

이 과정에서 인터페이스와 같아질 때까지 필요한 동작을 클래스로 옮겨야 한다. 이 기법으로는 **함수 옮기기** (8.1절)을 이용하자.

여기서 대안 클래스들 사이에서 중복 코드가 생긴다면 **슈퍼 클래스 추출하기** (12.8절)을 적용할지 고민해본다.

<br/>

## 3.22 데이터 클래스 (Data Class)
데이터 클래스란 클래스가 필드와 Getter/Setter 메서드만 가지고 있는 클래스다.

이런 클래스는 다른 클래스에서 멋대로 변경하고 사용할 여지가 있으므로 캡슐화하는 게 좋다.

그러므로 **public 필드가 있다면 레코드 캡슐화하기** (7.1절)로 숨기고 

변경하면 안되는 데이터가 있다면 **Setter 제거하기** (11.7절)로 제거하자.

다른 클래스에서 데이터 클래스의 getter/setter를 이용해서 동작하는 메소드가 있다면 이를 데이터 클래스로 옮길 수 있는지 알아보자. (단순 getter/setter가 아닌 데이터 클래스에 처리하도록 하자.)

**함수 옮기기** (8.1절)로 옮기고 함수의 일부만 그렇다면 **함수 추출하기** (6.1절)로 추출한 후 옮기자.

이렇게 데이터 클래스가 있다는 뜻은 데이터 클래스의 동작들이 다른 곳에 있다는 말 일수도 있다.

예외적으로 데이터 클래스가 있어야 하는 경우도 있는데 이 경우는 단계 쪼개기 (6.11절)을 통해서 만들어진 중간 결과인 경우다.

이 경우는 이 객체가 수정될 여지가 없으므로 getter도 필요 없고 바로 필드로 접근해도 좋다.

<br/>

## 3.23 상속 포기하기 (Refused Bequest)
서브 클래스는 부모로부터 메소드와 데이터를 물려받는다.

그렇지만 일부만 필요하고 일부는 필요 없다면 어떻게 할까?

예전에는 이를 설계를 잘못했기 때문이라고 생각했다.

그래서 **메소드 내리기** (12.4절)와 **필드 내리기** (12.5절)를 활용해서 부모에는 진짜 공통적인 부분만 남기려고 했다.

지금은 이 방식을 무조건 권하지는 않는다. 하지만 대게는 공통적인 속성을 남겨놔서 재활용하는 이 기법은 유용하다.

상속을 포기하는 시점은 자식 클래스가 부모 클래스의 동작은 필요하지만 인터페이스를 따를 필요는 없다고 생각되는 시점이다.

이 경우에 **서브 클래스를 위임으로 바꾸기** (12.10절) 기법을 이용하거나 **슈퍼 클래스를 위임으로 바꾸기** (12.11절)을 활용해 상속 메커니즘에서 벗어날 수 있다.

<br/>

## 3.24 주석 (Comments)
주석을 달지 마라고 말하지는 않겠다. 올바른 주석은 향기를 불러일으킨다.

주석이 너무 많다는 건 악취를 만드는 코드가 많다는 뜻이다.

특정 코드 블록이 하는 일에 주석을 남기고 싶다면 **함수 추출하기** (6.1절)을 적용하고

이미 추출되어 있는 함수에서도 주석을 달려고 한다면 **함수 선언 바꾸기** (6.5절)로 함수 이름을 좀 더 명확히 하는 일이 뭔지 설명할 수 있도록 바꾸자.

시스템이 동작하기 위한 선행조건을 명시하고 싶다면 **어서션 추가하기** (10.6)을 적용한다.
