import { LocalDateTime } from '@js-joda/core';

interface Photo {
    title: string;
    location: string;
    date: LocalDateTime;
    url: string;
}

interface Person {
    name: string;
    photo: Photo;
}

const renderPhoto = (photo: Photo) => {
    return `<img src="${photo.url}" />`;
};
const emitPhotoData = (photo: Photo) => {
    const result = [];
    result.push(`<p>위치: ${photo.location}</p>`);
    result.push(`<p>날짜: ${photo.date}</p>`);
    return result.join('\n');
};

const renderPerson = (person: Person) => {
    const result = [];
    result.push(`<p>${person.name}</p>`);
    result.push(renderPhoto(person.photo));
    result.push(`<p>제목: ${person.photo.title}</p>`);
    result.push(emitPhotoData(person.photo));
    return result.join('\n');
};

const photoDiv = (p: Photo) => ['<div>', `<p>제목: ${p.title}</p>`, emitPhotoData(p), '</div>'].join('\n');

const photo = {title: 'Title', location: '고속터미널', date: LocalDateTime.now(), url: 'http://abc.com'};
console.log('** renderPerson **\n', renderPerson({name: '제이미', photo}));
console.log('\n** photoDiv **\n', photoDiv(photo));
