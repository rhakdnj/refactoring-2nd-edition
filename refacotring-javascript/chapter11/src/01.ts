const setOffAlarms = () => console.warn('악당을 찾았소');

const findMiscreant = (people: string[]) =>
    people.find((p: string) => ['조커', '사루만'].includes(p)) ?? '';

const alertForMiscreant = (people: string[]) => {
    if (findMiscreant(people) != '') {
        setOffAlarms();
    }
};


const people = ['슈퍼맨', '배트맨', '아이언맨', '사루만', '블랙위도우', '조커', '스파이더맨'];
const found = findMiscreant(people);
alertForMiscreant(people);
