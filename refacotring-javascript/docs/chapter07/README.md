# 캡슐화

모듈을 분리하는 가장 중요한 기준은 필요 없는 정보는 드러내지 않는 것이다.

이러한 방법은 캡슐화를 통해서 가능하다.

대표적인 방법으로는 **레코드 캡슐화하기**(7.1절)와 **컬렉션 캡슐화하기**(7.2절)로 캡슐화해서 숨길 수 있다.

심지어 기본형 데이터 구조도 **기본형을 객체로 바꾸기**(7.3절)로 캡슐화할 수 있다.

클래스는 본래 정보를 숨기는 용도로 설계되었다.

앞 장에서는 **여러 함수를 클래스로 묶기**(6.9절)로 클래스를 만드는 방법을 소개했다.

이 외에도 흔히 사용하는 추출하기/인라인하기 리팩터링의 클래스 버전인 **클래스 추출하기**(7.5절)와 **클래스 인라인하기**(7.6절)도 있다.

클래스는 내부 정보 뿐 아니라 연결 관계를 숨기는 데도 유용한데, 이 용도로는 **위임 숨기기**(7.7절)이 있다.

하지만 너무 많이 숨기려다 보면 인터페이스가 비대해질 수 있으니 반대 기법인 **중개자 제거하기**(7.8절)도 필요하다.

가장 큰 캡슐화 단위는 클래스와 모듈이지만 함수도 구현을 캡슐화한다.

때로는 알고리즘을 통째로 바꿔야 하는 경우가 있는데, **함수 추출하기**(6.1절)로 알고리즘 전체를 함수 하나에 담은 뒤 **알고리즘 교체하기**(7.9절)를 적용하면 된다.

<br/>

## 7.1 레코드 캡슐화 하기

### 배경

```ts
const organization = {
    name: '애크미 구스베리',
    country: 'GB'
};
```

레코드를 다룰 때 주의할 점은 계산해서 얻을 수 있는 값과 그렇지 않은 값은 구별해야 한다는 점이다.

이러한 이유로 가변 데이터에서는 레코드 대신 클래스를 이용하는 걸 선호한다.

클래스를 이용하면 어떠한 데이터를 제공해 주는지 메소드를 보면 바로 알 수 있다.

데이터가 불변 데이터인 경우에는 값만 제공해 주면 되므로 굳이 클래스를 쓰지는 않는다.

### 절차

1. 레코드를 담은 변수를 캡슐화(6.6 절)한다.

2. 레코드를 감싼 단순한 클래스로 해당 변수의 내용을 교체한다. 이 클래스에 원본 레코드를 반환하는 접근자도 정의하고, 변수를 사용하는 함수들은 이 접근자를 이용하도록 한다.

3. 테스트 한다.

4. 원본 레코드 대신 새로 정의한 클래스 타입의 객체를 반환하는 함수들을 새로 만든다.

5. 레코드를 반환하는 예전 함수를 새로 만든 함수로 바꾼다.

<br/>

### 예시: 간단한 레코드 캡슐화하기

```ts
let result = '';
const organization = {name: '애크미 구스베리', country: 'GB'};

organization.name = '애그머니 블루베리';
result += `<h1>${organization.name}</h1>`;

console.log(result);
```

가장 먼저 이 상수를 캡슐화해보자.

```ts
let result = '';
const organization = {name: '애크미 구스베리', country: 'GB'};

const getRawDataOfOrganization = () => {
    return organization;
}

getRawDataOfOrganization().name = '애그머니 블루베리';
result += `<h1>${getRawDataOfOrganization().name}</h1>`;

console.log(result);
```

레코드를 캡슐화하는 목적은 변수 자체는 물론 그 내용을 조작하는 방식도 통제하기 위해서다.

다음과 같이 레코드를 클래스로, 새 클래스의 인스턴스를 반환하는 함수를 새로 만든다.

```ts
let result = '';

class Organization {
    _data;

    constructor(data: any) {
        this._data = data;
    }
}

const organization = new Organization({name: '애크미 구스베리', country: 'GB'});

const getRawDataOfOrganization = () => {
    return organization._data;
}
const getOrganization = () => {
    return organization;
}

getRawDataOfOrganization().name = '애그머니 블루베리';
result += `<h1>${getRawDataOfOrganization().name}</h1>`;

console.log(result);
```

레코드를 갱신하던 코드는 모두 세터를 사용하도록 고친다.

레코드를 읽는 코드는 모두 게터를 사용하게 바꾼다.

```ts
let result = '';

class Organization {
    _data;

    constructor(data: any) {
        this._data = data;
    }

    set name(name: string) {
        this._data.name = name;
    }

    get name() {
        return this._data.name;
    }
}

const organization = new Organization({name: '애크미 구스베리', country: 'GB'});

const getRawDataOfOrganization = () => {
    return organization._data;
}
const getOrganization = () => {
    return organization;
}

getOrganization().name = '애그머니 블루베리';
result += `<h1>${getOrganization().name}</h1>`;

console.log(result);
```

이후 임시 함수를 제거한다.

마지막으로 _data의 필드들을 객체 안에 바로 펼친다.

```ts
let result = '';

class Organization {
    _name;
    _country;

    constructor(data: any) {
        this._name = data.name;
        this._country = data.country;
    }

    set name(name: string) {
        this._name = name;
    }

    set country(country: string) {
        this._country = country;
    }

    get name() {
        return this._name;
    }

    get country() {
        return this._country;
    }
}

const organization = new Organization({name: '애크미 구스베리', country: 'GB'});

organization.name = '애그머니 블루베리';
result += `<h1>${organization.name}</h1>`;

console.log(result);
```

<br/>

### 예시: 중첩된 레코드 캡슐화하기

JSON 문서처럼 여러 겹 중첩된 레코드라면 어떻게 해야 할까?

```json
{
  "1920": {
    "name": "마틴 파울러",
    "id": "1920",
    "usages": {
      "2016": {
        "1": 50,
        "2": 55
      },
      "2015": {
        "1": 70,
        "2": 63
      }
    }
  },
  "38673": {
    "name": "닐 포드",
    "id": "38673",
    "usages": {
      "2016": {
        "1": 30,
        "2": 45
      },
      "2015": {
        "1": 60,
        "2": 73
      }
    }
  }
}
```

중첩 정도가 심할수록 읽거나 쓸 때 데이터 구조 안으로 더 깊숙히 들어가야 한다.

> 쓰기 예  
`customerData[customerID].usages[year][month] = amount`

> 읽기 예  
> `customerData[customerID].usages[year][month]`

**변수 캡슐화**(6.6절)부터 시작한다.

```ts
import { readJSON } from '../../file.controller';
import * as path from 'path';

let customerData = readJSON(path.resolve(__dirname, '01-2.json'));

const getRawDataOfCustomers = () => customerData;

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    getRawDataOfCustomers()[customerId].usages[year][month] = amount;
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = customerData[customerId].usages[laterYear][month];
    const earlier = customerData[customerId].usages[laterYear - 1][month];
    return {laterAmount: later, change: later - earlier};
};

export const getCustomer = () => customerData;
```

클래스를 정의하고, 이를 반환 함수를 추가한다.

```ts
import { readJSON } from '../../file.controller';
import * as path from 'path';

class CustomerData {
    _data;

    constructor(data: any) {
        this._data = data;
    }
}

let customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')));

const getCustomerData = () => customerData;
export const getRawDataOfCustomers = () => customerData._data;
const setRawDataOfCustomers = (data: any) => {
    customerData = new CustomerData(data);
};

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    getRawDataOfCustomers()[customerId].usages[year][month] = amount;
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = getRawDataOfCustomers()[customerId].usages[laterYear][month];
    const earlier = getRawDataOfCustomers()[customerId].usages[laterYear - 1][month];
    return {laterAmount: later, change: later - earlier};
};
```

데이터 구조 안으로 들어가는 코드를 세터로 뽑아내는 작업부터 한다.

```ts
const setUsage = (customerId: string, year: string, month: number, amount: number) => {
    getRawDataOfCustomers()[customerId].usages[year][month] = amount;
}

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    setUsage(customerId, year, month, amount);
};
```

그런 다음 이 함수를 고객 데이터 클래스로 옮긴다.

나는 덩치 큰 데이터 구조를 다룰수록 쓰기 부분에 집중한다.

우선 getRawDataOfCustomers()에서 데이터를 깊은 복사(deep copy)하여 반환하는 방법이다.

```ts
import { readJSON } from '../../file.controller';
import * as path from 'path';
import { cloneDeep } from 'lodash';

class CustomerData {
    _data;

    constructor(data: any) {
        this._data = data;
    }

    setUsage = (customerId: string, year: string, month: number, amount: number) => {
        getRawDataOfCustomers()[customerId].usages[year][month] = amount;
    }

    get rawData() {
        return cloneDeep(this._data);
    }
}

let customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')));

const getCustomerData = () => customerData;
export const getRawDataOfCustomers = () => customerData.rawData;
const setRawDataOfCustomers = (data: any) => {
    customerData = new CustomerData(data);
};

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    getCustomerData().setUsage(customerId, year, month, amount);
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = getRawDataOfCustomers()[customerId].usages[laterYear][month];
    const earlier = getRawDataOfCustomers()[customerId].usages[laterYear - 1][month];
    return {laterAmount: later, change: later - earlier};
};
```

이에 추가적으로 `usage()` 조회 함수를 추가하자.

```ts
import { readJSON } from '../../file.controller';
import * as path from 'path';
import { cloneDeep } from 'lodash';

class CustomerData {
    _data;

    constructor(data: any) {
        this._data = data;
    }

    usage(customerId: string, year: number, month: number) {
        return this._data[customerId].usages[year][month];
    }

    setUsage = (customerId: string, year: string, month: number, amount: number) => {
        getRawDataOfCustomers()[customerId].usages[year][month] = amount;
    }

    get rawData() {
        return cloneDeep(this._data);
    }
}

let customerData = new CustomerData(readJSON(path.resolve(__dirname, '01-2.json')));

const getCustomerData = () => customerData;
export const getRawDataOfCustomers = () => customerData.rawData;
const setRawDataOfCustomers = (data: any) => {
    customerData = new CustomerData(data);
};

export const writeData = (customerId: string, year: string, month: number, amount: number) => {
    getCustomerData().setUsage(customerId, year, month, amount);
};

export const compareUsage = (customerId: string, laterYear: number, month: number) => {
    const later = getRawDataOfCustomers()[customerId].usages[laterYear][month];
    const earlier = getRawDataOfCustomers()[customerId].usages[laterYear - 1][month];
    return {laterAmount: later, change: later - earlier};
};
```

<br/>

## 7.2 컬렉션 캡슐화하기

### 배경

나는 가변 데이터는 모두 캡슐화하는 편이다.

이렇게 할 경우 데이터들이 언제 어떻게 수정되는지 추적하기 좋기 때문이다.

컬렉션 구조를 사용할 때 주의할 점이 있는데 컬렉션 안의 요소를 변경하는 작업이 필요한 건 클래스 메서드로 따로 만들어 두는 것이다. 예로 add() remove()라는 이름의 컬렉션 변경자 메서드를 만든다.

이 말은 컬렉션 자체를 반환하는 것을 막는다는 건 아니다.

컬렉션 자체 반환을 막도록 하면 컬렉션에서 사용할 수 있는 다채로운 인터페이스를 사용하는 데 제한이 걸리기 때문이다.

그래서 컬렉션 변경과 같은 작업은 클래스 메서드를 통해서 이뤄지도록 하고

컬렉션을 반환하는 getter 함수는 컬렉션 자체를 반환하는 것이 아니라 복사본을 반환하도록 하자. 그리고 컬렉션을 통째로 변경할 수 있는 세터는 없애도록 하자. 없앨 수 없으면 인수로 전달받은 컬렉션을 복제본으로
가져와서 원본에 영향이 안 가게 하자.

물론 원본에 영향이 안 가는 게 이상하다고 느낄 순 있지만 대부분의 프로그래머는 이 패턴을 이용하니까 이상하게 느껴지는 않을 것이다. 물론 성능적으로 크게 문제가 된다면 이를 적용하면 안 되겠지만 그럴 일은 거의
없다.

이 방법 외에도 컬렉션을 읽기 전용으로 해놓고 사용하는 방법도 있다.

여기서 중요한 점은 코드 베이스에서 일관성을 주는 것이다. 한 패턴을 적용하기로 했다면 통일하자.

<br/>

### 절차

1. 아직 컬렉션을 캡슐화하지 않았다면 변수 캡슐화하기(6.6절)부터 한다.
2. 컬렉션에 원소를 추가/제거 하는 함수를 만든다. (컬렉션을 통째로 변경하는 세터를 모두 제거(11.7절)하고 인수로 받은 컬렉션은 복제본을 사용하도록 하자)
3. 정적 검사를 수행한다.
4. 컬렉션을 참조하는 부분을 찾고 하나씩 클래스로 바꾸자. 하나씩 수정할 때마다 테스트한다.
5. 컬렉션 세터를 수정해서 원본 내용을 수정할 수 없는 읽기 전용 프록시나 복제본을 반환하도록 한다.
6. 테스트한다.

<br/>

### 예시

수업(course) 목록을 필드고 지니고 있는 Person 클래스로 예로 살펴보자.

```ts
const COURSES = {
    korean: {basic: 'korean', advanced: 'korean advanced'},
    english: {basic: 'english', advanced: 'english advanced'},
    mathematics: {basic: 'mathematics', advanced: 'mathematics advanced'},
};

class Person {
    private readonly _name: string;
    private _courses: string[] = [];

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get courses() {
        return this._courses;
    }

    set courses(courses) {
        this._courses = courses;
    }
}

class Course {
    private readonly _name: string;
    private readonly _isAdvanced: boolean;

    constructor(name: string, isAdvanced: boolean) {
        this._name = name;
        this._isAdvanced = isAdvanced;
    }

    get name() {
        return this._name;
    }

    get isAdvanced() {
        return this._isAdvanced;
    }
}

const readBasicCourseNames = (filename: any) => Object.values(filename).map((c: any) => c.basic);

const clientA = () => {
    const person: any = new Person('파울러');

    const numAdvancedCourses = person.courses
        .filter((c: Course) => c.isAdvanced)
        .length;

    const basicCourseNames = readBasicCourseNames(COURSES);
    person.courses = basicCourseNames.map((name: string) => new Course(name, false));

    return person;
};
console.log(clientA());
```

모든 필드가 접근자 메서드로 보호받고 있으니 안이한 개발자는 이렇게만 해도 데이터를 제대로 캡슐화했다고 생각하기 쉽다.

하지만 수업 컬렉션을 통째로 설정한 클라이언트는 누구든 이 컬렉션을 마음대로 수정할 수 있다.

```ts
const basicCourseNames = readBasicCourseNames(COURSES);
person.courses = basicCourseNames.map((name: string) => new Course(name, false));
```

하지만 이런 식으로 목록을 갱신하면 Person 클래스는 더는 컬렉션을 제어할 수 없으니 캡슐화가 깨진다.

필드를 참조하는 과정만 캡슐화했을 뿐 필드에 담긴 내용은 캡슐화하지 않은 게 원인이다.

```ts
class Person {
    private readonly _name: string;
    private _courses: string[] = [];

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get courses() {
        return this._courses;
    }

    set courses(courses) {
        this._courses = courses;
    }

    public addCourse(course) {
        this._courses.push(course);
    }

    public removeCourse(course, fnIfAbsent = () => {
        throw new RangeError();
    }) {
        const index = this._courses.indexOf(course);
        if (index === -1) {
            fnIfAbsent();
        } else {
            this._courses.splice(index, 1);
        }
    }
}
```

여기서는 기본적으로 에러를 던지되, 호출자가 원하는 방식으로 처리할 여지도 남겨뒀다.

그런 다음 컬렉션의 변경자를 직접 호출하던 코드를 모두 찾아서 추가한 메서드를 사용하도록 바꾼다.

```ts
const basicCourseNames = readBasicCourseNames(COURSES);
basicCourseNames.forEach((name: string) => {
    person.addCourse(new Course(name, false));
});
```

개별 원소를 추가하고 제거하는 메서드를 제공하기 때문에 setCourses()를 제거한다.(세터 제거하기(11.7절))

그 다음 getter에서 원본을 그대로 노출시키는게 아니라 복사본을 주도록 바꾸자.

```ts
class Person {
    private readonly _name: string;
    private readonly _courses: string[] = [];

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get courses() {
        return [...this._courses];
    }

    public addCourse(course) {
        this._courses.push(course);
    }

    public removeCourse(course, fnIfAbsent = () => {
        throw new RangeError();
    }) {
        const index = this._courses.indexOf(course);
        if (index === -1) {
            fnIfAbsent();
        } else {
            this._courses.splice(index, 1);
        }
    }
}
```

<br/>

## 7.3 기본형을 객체로 바꾸기

### 배경

개발 초기에는 단순한 정보를 숫자나 문자열을 표현했던 데이터들이 프로그램 규모가 커질수록 간단하지 않게 변한다.

예컨대 전화번호 같은 문자열 데이터가 나중에는 포매팅이나 지역 코드 추출과 같은 특별한 동작이 필요해질 수 있다.

나는 데이터가 단순히 출력 이상의 기능이 필요해진다면 클래스로 바꾼다.

이렇게 바꿈으로써 나중에 특별한 동작이 필요해지면 이 클래스에 추가하면 되므로 유용하다.

<br/>

### 절차

1. 아직 변수를 캡슐화하지 않았다면 캡슐화(6.6절)부터 한다.
2. 단순한 값 클래스(Value Class)를 만든다. 생성자는 기존 값을 인수로 받아서 자장하고, 이 값을 반환하는 게터를 추가한다.
3. 정적 검사를 수행한다.
4. 값 클래스의 인스턴스를 새로 만들어서 필드에 저장하도록 세터를 수정한다. 이미 있다면 필드의 타입을 적절히 변경한다.
5. 새로 만든 클래스의 게터를 호출한 결과를 반환하도록 게터를 수정한다.
6. 테스트한다.
7. 함수 이름을 바꾸면(6.5절) 원본 접근자의 동작을 더 잘 드러낼 수 있는지 검토한다. (참조를 값으로 바꾸거나(9.4절) 값을 참조로 바꾸면(9.5절) 새로 만든 객체의 역할(값 또는 참조 객체)이 더
   잘 드러나는지 검토한다.)

<br/>

### 예시

단순한 주문 (Order) 클래스가 있다고 생각해보자.

이 클래스는 우선순위 (Priority) 라는 항목이 있고 이것은 지금 문자열로 받는 구조다.

```ts
class Order {
    #priority: Priority;

    constructor(data: any) {
        this.#priority = new Priority(data.priority);
    }

    get priorityString(): string {
        return this.#priority.toString();
    }

    get priority(): Priority {
        return this.#priority;
    }
}

type PriorityType = 'low' | 'normal' | 'high' | 'rush';

class Priority {
    static legalValues(): PriorityType[] {
        return ['low', 'normal', 'high', 'rush'];
    }

    private readonly _value: PriorityType;

    constructor(value: PriorityType) {
        this._value = value;
    }

    toString(): PriorityType {
        return this.#value;
    }

    public get index() {
        return Priority.legalValues().findIndex((s: PriorityType) => s === this.#value);
    }

    public equals(other: Priority): boolean {
        return this.index === other.index;
    }

    public higherThan(other: Priority): boolean {
        return this.index > other.index;
    }

    public lowerThan(other: Priority) {
        return this.index < other.index;
    }
}

const client1 = () => {
    const orders: Order[] = [{priority: 'high'}, {priority: 'rush'}, {priority: 'low'}, {priority: 'normal'}].map(
        o => new Order(o),
    );

    const highPriorityCount: number = orders.filter(
        o => o.priority.higherThan(new Priority('normal'))
    ).length;

    return highPriorityCount;
};
console.log(client1());
```

<br/>

## 7.4 임시 변수를 질의 함수로 바꾸기

### 배경

함수 안에서 어떤 코드의 결괏값을 뒤에서 다시 참조할 목적으로 임시 변수를 사용한다.

임시 변수는 계산된 결과를 반복적으로 계산하지 않기 위해서 사용하는데 이는 함수로 만들어 두는 게 유용한 경우가 있다.

그래서 나는 여러 곳에서 똑같은 방식으로 계산되는 변수를 보면 이를 함수로 추출해 놓는다.

주로 함수를 추출할 때 임시 변수가 문제가 되는데 함수의 파라미터 수를 줄이는데 기여를 한다.

<br/>

### 절차

1. 변수가 사용되기 전에 값이 확실히 결정되는지, 즉 매번 다른 결과를 내지 않는지 확인한다.
2. 읽기전용으로 만들 수 있는 변수는 읽기전용으로 만든다.
3. 테스트한다.
4. 변수 대입문을 함수로 추출한다. (변수와 함수가 같은 이름을 가질 수 없다면 함수 이름을 임시로 짓는다. 또한, 추출한 함수가 부수 효과를 일으키지는 않는지 확인한다.)
5. 테스트한다.

<br/>

### 예시

```ts
class Order {
    _quantity: number;
    _item: { price: number };

    constructor(quantity: number, item: { price: number }) {
        this._quantity = quantity;
        this._item = item;
    }

    get price() {
        let basePrice: number = this._quantity * this._item.price;
        let discountFactor: number = 0.98;
        if (basePrice > 1000) discountFactor -= 0.03;
        return basePrice * discountFactor;
    }
}
```

여기서 임시 변수인 basePrice와 discountFactor를 메서드로 바꾸는 리팩터링을 해보자.

읽기전용 변수가 아닌 경우에는 메서드로 빼기 어렵기 때문에 임시변수에 `readonly` 키워드를 통해 읽기전용인지 확인해 보자.

먼저 basePrice 변수인 경우에는 읽기전용으로 사용할 수 있기 때문에 금방 빼낼 수 있다.

```ts
class Order {
    _quantity: number;
    _item: { price: number };

    constructor(quantity: number, item: { price: number }) {
        this._quantity = quantity;
        this._item = item;
    }

    get price() {
        return this.basePrice * this.discountFactor;
    }

    private get basePrice(): number {
        return this._quantity * this._item.price;
    }
}
```

다음으로 빼낼 변수는 discountFactor 이는 대입하는 경우가 있으므로 이 부분까지 고려해서 함수를 추출해야 한다.

```ts
class Order {
    _quantity: number;
    _item: { price: number };

    constructor(quantity: number, item: { price: number }) {
        this._quantity = quantity;
        this._item = item;
    }

    get price() {
        return this.basePrice * this.discountFactor;
    }

    private get basePrice(): number {
        return this._quantity * this._item.price;
    }

    private get discountFactor(): number {
        let discountFactor: number = 0.98;
        if (this.basePrice > 1000) {
            discountFactor -= 0.03;
        }
        return discountFactor;
    }
}
```

<br/>

## 7.5 클래스 추출하기

### 배경

클래스는 반드시 명확하게 추상화하고 주어진 소수의 역할만 처리해야 한다.

하지만 실무에서는 주어진 클래스에 데이터와 동작이 계속해서 추가되면서 커지는 경우가 많다.

역할이 많아지고 데이터와 메서드가 많은 클래스는 이해하기 어렵다.

일부 메서드와 데이터를 따로 묶을 수 있다면 클래스를 분리하라는 신호다.

또 함께 변경되는 일이 많거나 서로 의존하는 데이터가 많다면 이도 분리할 수 있다는 신호다.

<br/>

### 절차

1. 클래스의 역할을 분리하는 방법을 정한다.
2. 분리될 역할을 담당할 클래스를 새로 만든다.
3. 원래 클래스의 생성자에서 새로운 클래스의 인스턴스를 생성하여 필드에 저장해 둔다.
4. 분리될 역할에 필요할 필드들을 새 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
5. 메서드들도 새 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
6. 양쪽 클래스의 인터페이스를 살펴보면서 메서드를 제거하고 이름도 새로운 환경에 맞게 바꾼다.
7. 새 클래스를 외부로 노출할지 정한다.

<br/>

### 예시

단순한 Person 클래스를 예로 준비했다.

```ts
class Person {
    private _name: string = '';
    private _officeAreaCode: string = '';
    private _officeNumber: string = '';

    get name() {
        return this._name;
    }

    set name(arg) {
        this._name = arg;
    }

    get officeAreaCode() {
        return this._officeAreaCode;
    }

    set officeAreaCode(arg) {
        this._officeAreaCode = arg;
    }

    get officeNumber() {
        return this._officeNumber;
    }

    set officeNumber(arg) {
        this._officeNumber = arg;
    }

    get telephoneNumber() {
        return `(${this.officeAreaCode}) ${this.officeNumber}`;
    }
}
```

여기서 전화번호를 별도의 클래스로 뽑아보자.

연관된 필드와 메서드를 하나씩 옮기자.

```ts
class Person {
    private _name: string = '';
    private readonly _telephoneNumber: TelephoneNumber

    constructor(name: string, telephoneNumber: TelephoneNumber) {
        this._name = name;
        this._telephoneNumber = telephoneNumber;
    }

    get name() {
        return this._name;
    }

    set name(arg) {
        this._name = arg;
    }
}

class TelephoneNumber {
    private _officeAreaCode: string;
    private _officeNumber: string;

    constructor(officeAreaCode: string, officeNumber: string) {
        this._officeAreaCode = officeAreaCode;
        this._officeNumber = officeNumber;
    }

    get telephoneNumber() {
        return `(${this.officeAreaCode}) ${this.officeNumber}`;
    }

    get officeAreaCode(): string {
        return this._officeAreaCode;
    }

    set officeAreaCode(arg) {
        this._officeAreaCode = arg;
    }

    get officeNumber() {
        return this._officeNumber;
    }

    set officeNumber(arg) {
        this._officeNumber = arg;
    }
}
```

이후에는 메소드의 이름을 적절하게 바꾸자.

여기서 TelephoneNumber 클래스를 맥락으로 주고 있으므로 굳이 office 라는 단어를 사용할 필요는 없다.

또한 전화번호를 사람이 읽기 좋은 포맷으로 출력하는 역할도 전화번호 클래스에게 맡긴다.

전화번호 클래스는 여러모로 쓸모가 많으니 이 클래스는 클라이언트에게 공개한다. (`export`)

```ts
class Person {
    private _name: string;
    private readonly _telephoneNumber: TelephoneNumber;

    constructor(name: string, telephoneNumber: TelephoneNumber) {
        this._name = name;
        this._telephoneNumber = telephoneNumber;
    }

    get name() {
        return this._name;
    }

    set name(arg) {
        this._name = arg;
    }

    get officeAreaCode() {
        return this._telephoneNumber.areaCode;
    }

    set officeAreaCode(arg: string) {
        this._telephoneNumber.areaCode = arg;
    }

    get officeNumber() {
        return this._telephoneNumber.number;
    }

    set officeNumber(arg: string) {
        this._telephoneNumber.number = arg;
    }

    get telephoneNumber() {
        return this._telephoneNumber.toString();
    }
}

class TelephoneNumber {
    private _areaCode: string;
    private _number: string;

    constructor(areaCode: string, number: string) {
        this._areaCode = areaCode;
        this._number = number;
    }

    toString() {
        return `(${this.areaCode}) ${this.number}`;
    }

    get areaCode(): string {
        return this._areaCode;
    }

    set areaCode(arg) {
        this._areaCode = arg;
    }

    get number(): string {
        return this._number;
    }

    set number(arg) {
        this._number = arg;
    }
}
```

<br/>

## 7.6 클래스 인라인하기

### 배경

클래스 인라인 하기는 클래스 추출하기의 반대되는 리팩터링 기법이다.

나는 더 이상 제 역할을 하지 못하는 클래스가 있다면 인라인해버린다.

주로 역할을 옮기는 리팩터링 이후 남은 역할이 거의 없을 때 이 클래스를 가장 많이 사용하는 클래스로 옮긴다.

두 클래스의 기능을 다시 배분하고 싶을 때 인라인 하는 기법을 사용하기도 한다.

애매한 역할을 하는 두 클래스가 있다면 **그것들을 합쳐서 새로운 클래스를 추출**(7.5절) 하는 게 더 나을 수 있기 때문이다.

<br/>

### 절차

1. 소스 클래스(인라인 하려는 클래스)의 public 메서드들을 타깃 클래스에 생성한다.
2. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스의 위임 메서드를 사용하도록 바꾼다. 하나씩 바꿀 때마다 테스트한다.
3. 소스 클래스의 메서드와 필드를 모두 타깃 클래스로 옮긴다. 하나씩 옮길 때마다 테스트한다.
4. 소스 클래스를 삭제한다.

<br/>

### 예시

배송 추적 정보를 표현하는 TrackingInformation 클래스가 있다.

```ts
class TrackingInformation {
    private _shippingCompany: string | undefined;
    private _trackingNumber: string | undefined;

    get display() {
        return `${this._shippingCompany}: ${this._trackingNumber}`;
    }

    // getter, setter
}
```

TrackingInformation 클래스는 배송(Shipment) 클래스의 일부처럼 사용된다.

```ts
class Shipment {
    private _trackingInformation: TrackingInformation;

    constructor() {
        this._trackingInformation = new TrackingInformation();
    }

    get trackingInfo() {
        return this._trackingInformation.display;
    }

    // getter, setter
}
```

여기서 TrackingInformation 클래스가 제 역할을 하지 못한다고 판단해 인라인하려고 한다.

여기서 먼저 기존의 TrackingInformation에서 사용하는 메소드들을 모두 Shipment 클래스로 옮긴다.

그 다음 TrackingInformation의 모든 요소를 옮긴다.

순서로 옮기는 것 보다는 소스 클래스(인라인 하고 싶은 클래스)를 전체 옮기고, 이후 절차를 따른다.

```ts
class Shipment {
    private _shippingCompany: string | undefined; // 배송 회사
    private _trackingNumber: string | undefined; // 추적 번호

    get trackingInfo() {
        return `${this._shippingCompany}: ${this._trackingNumber}`;
    }

    set shippingCompany(arg: string) {
        this._shippingCompany = arg;
    }

    set trackingNumber(arg: string) {
        this._trackingNumber = arg;
    }
}
```

<br/>

## 7.7 위임 숨기기

### 배경

모듈화 설계를 제대로 하는 핵심은 캡슐화다.

캡슐화는 모듈이 노출하는 요소를 제한해서 꼭 필요한 부분을 위주로 협력하도록 해준다.

캡슐화가 잘 되어 있다면 무언가를 변경할 때 함께 고려해야 할 모듈수가 적어져서 코드를 변경하기 쉬워진다.

예로 객체가 다른 객체의 메서드를 호출하려면 그 객체를 알아야 한다.

근데 호출당하는 객체의 인터페이스가 변경되면 그 객체를 알고 있는 모든 객체가 변경해야 한다.

이런 경우가 발생할 수 있다면 그 객체를 노출하지 않으면 된다. 숨기면 된다. 그러면 아무런 영향을 받지 않는다.

이렇게 객체가 다른 객체를 알면 안 되는 경우 즉 객체와 다른 객체가 결합하면 안 되는 경우에 이 기법을 쓰면 좋다.

![img.png](https://user-images.githubusercontent.com/74996516/278849975-5c206790-b690-4913-8344-919f35dd34df.png)

<br/>

### 절차

1. 위임 객체의 각 메서드에 해당하는 위임 메서드를 서버 객체에 생성한다. (서버 객체가 대신 호출해 주는 구조)
2. 클라이언트가 위임 객체 대신 서버를 호출하도록 수정한다. 하나씩 수정할 때마다 테스트한다.
3. 모두 수정했다면 서버로부터 위임 객체를 얻는 접근자를 제거한다.
4. 테스트한다.

<br/>

### 예시

사람(Person)과 사람이 속한 부서(Department)가 있다고 하자.

```ts
class Person {
    _name: string;
    _department: Department | undefined;

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get department() {
        return this._department;
    }

    set department(arg) {
        this._department = arg;
    }
}

class Department {
    _chargeCode: string;
    _manager: string;

    constructor(chargeCode: string, manager: string) {
        this._chargeCode = chargeCode;
        this._manager = manager;
    }

    get chargeCode() {
        return this._chargeCode;
    }

    set chargeCode(arg) {
        this._chargeCode = arg;
    }

    get manager() {
        return this._manager;
    }

    set manager(arg) {
        this._manager = arg;
    }
}

const feDev = new Department('BACKEND', '로이');
const jn = new Person('rhakdnj');
jn.department = feDev;

console.log(jn.department?.manager);
```

클라이언트에서 어떤 사람이 속한 부서의 관리자를 알고 싶다고 하자.

부서 객체를 얻어와야한다.

다음과 같이 부서 객체를 통해 manager를 접근해야 한다.

항상 부서 클래스를 통해서 매니저를 조회하는데 이런 의존성을 줄이고 싶다면 사람 클래스에 간단히 위임 메소드를 만들면 된다.

```ts
class Person {
    public get manager(): string {
        return this.department.getManager();
    }
}
```

그리고 Person 객체에서 부서를 조회하는 메소드를 지우자.

<br/>

## 7.8 중개자 제거하기

### 배경

위임 숨기기(7.7절)의 반대되는 리팩터링이다.

위임 숨기기는 접근하려는 객체를 제한하는 캡슐화를 제공하는 이점으로 불필요한 결합이나 의존성을 제거해 주는 이점이 있다.

근데 만약 클래스에 위임이 너무 많다면 그냥 접근을 허용하도록 하는 게 더 나을 수도 있다.

즉 결합해야 하는 구조라면 결합하는 게 나을 수 있다.

객체가 단순히 중개자(middle man) 역할만 해준다면 이 리팩터링 기법을 고려해 보자.

<br/>

### 절차

1. 위임 객체를 얻는 게터를 만든다.
2. 위임 메서드를 호출하는 클라이언트가 이 게터를 거치도록 수정한다.
3. 하나씩 바꿀 때마다 테스트를 진행한다.
4. 모두 수정했다면 위임 메서드를 삭제한다.

<br/>

### 예시

```ts
class Person {
    _name: string;
    _department: Department;

    constructor(name: string, department: Department) {
        this._name = name;
        this._department = department;
    }

    get name() {
        return this._name;
    }

    get manager() {
        return this._department.manager;
    }
}

class Department {
    _manager: string;

    constructor(manager: string) {
        this._manager = manager;
    }

    get manager() {
        return this._manager;
    }
}
```

사용하기 쉽고 부서는 캡슐화되어 있다. 하지만 이런 위임 메서드가 많아지면 사람 클래스의 상당 부분이 그저 위임하는 데만 쓰일 것이다.

그럴 때는 중개자를 제거하는 편이 낫다.

위임 숨기기나 중개자 제거하기를 적당히 섞어도 된다.

<br/>

## 7.9 알고리즘 교체하기

### 배경

어떤 목적을 달성하는 방법은 여러 가지가 있다.

그 중에선 분명 더 나은 방법이 있을 것이다.

나는 이렇게 더 나은 방법을 찾아내면 복잡한 기존의 방법을 걷어내고 코드를 간명한 방식으로 고친다.

리팩터링하면 복잡한 대상을 단순한 단위로 나누는 게 가능하지만 이렇게 때로는 알고리즘 전체를 걷어내고 훨씬 간결한 알고리즘으로 바꿔야 할 때가 있다.

알고리즘을 살짝 다르게 동작하도록 바꾸고 실을 때도 통째로 바꾼 후에 처리하면 더 간단하게 할 수 있다.

이 방법을 하기 전에는 반드시 메서드를 가능한 한 잘게 나눴는지 확인하자.

<br/>

### 절차

1. 교체할 코드를 함수 하나에 모은다.
2. 이 함수만을 이용해 동작을 검증하는 테스트를 마련한다.
3. 대체할 알고리즘을 준비한다.
4. 정적 검사를 수행한다.
5. 기존 알고리즘과 새 알고리즈므이 결과를 비교하는 테스트를 수행한다. 두 결과가 같다면 리팩터링이 끝난다. 그렇지 않다면 기존 알고리즘을 참고해서 새 알고리즘을 테스트하고 디버깅한다.

<br/>

### 예시
