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

const emitPhotoData = (photo: Photo) =>
    [
        `<p>제목: ${photo.title}</p>`,
        `<p>위치: ${photo.location}</p>`,
        `<p>날짜: ${photo.date}</p>`,
    ].join('\n');

const renderPerson = (person: Person) =>
    [
        `<p>${person.name}</p>`,
        `<img src="${person.photo.url}" />`,
        emitPhotoData(person.photo)
    ].join('\n');

const photoDiv = (p: Photo) => ['<div>', emitPhotoData(p), '</div>'].join('\n');

const photo = {
    title: 'Title',
    location: '고속터미널',
    date: LocalDateTime.now(),
    url: 'http://abc.com'
};
console.log('** renderPerson **\n', renderPerson({name: '제이미', photo}));
console.log('\n** photoDiv **\n', photoDiv(photo));
