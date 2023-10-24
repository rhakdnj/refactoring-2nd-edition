const COURSES = {
    korean: {basic: 'korean', advanced: 'korean advanced'},
    english: {basic: 'english', advanced: 'english advanced'},
    mathematics: {basic: 'mathematics', advanced: 'mathematics advanced'},
};

// @ts-ignore
class Person {
    _name: string = '';
    _courses: Course[] = [];

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get courses() {
        return [...this._courses];
    }

    addCourse(course: Course) {
        this._courses.push(course);
    }

    removeCourse(course: Course, onError = () => {
        throw new RangeError();
    }) {
        const index = this._courses.indexOf(course);
        if (index === -1) {
            onError();
        } else {
            this._courses.splice(index, 1);
        }
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

const readBasicCourseNames = (filename: any) => Object.values(filename) // Array of Values
    .map((c: any) => c.basic);

const clientA = () => {
    const person: any = new Person('파울러');

    const numAdvancedCourses = person.courses.filter((c: any) => c.isAdvanced).length;

    for (const name of readBasicCourseNames(COURSES)) {
        person.addCourse(new Course(name, false));
    }

    return person;
};
console.log(clientA());
