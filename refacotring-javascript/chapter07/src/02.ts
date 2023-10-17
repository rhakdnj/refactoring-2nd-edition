const COURSES = {
    korean: {basic: 'korean', advanced: 'korean advanced'},
    english: {basic: 'english', advanced: 'english advanced'},
    mathematics: {basic: 'mathematics', advanced: 'mathematics advanced'},
};

// @ts-ignore
class Person {
    _name: string = '';
    _courses: string[] = [];

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get courses() {
        return this._courses;
    }

    set courses(aList) {
        this._courses = aList;
    }
}

class Course {
    _name: string = '';
    _isAdvanced: boolean = false;

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

    const numAdvancedCourses = person.courses.filter((c: any) => c.isAdvanced).length;

    const basicCourseNames = readBasicCourseNames(COURSES);
    person.courses = basicCourseNames.map((name: any) => new Course(name, false));

    return person;

    //
    // for(const name of readBasicCourseNames(COURSES)) {
    //   aPerson.courses.push(new Course(name, false))
    // }
};
console.log(clientA());
