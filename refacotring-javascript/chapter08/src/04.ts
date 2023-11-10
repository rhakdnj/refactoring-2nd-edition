import { LocalDateTime } from '@js-joda/core';

const previousDateFromNow = (days: number) => LocalDateTime.now().minusDays(days);
const recentDateCutoff = () => previousDateFromNow(3);

const renderPhoto = (outStream: any, photo: any) => {
    outStream.write(`<img src="${photo.url}" />`);
};
const emitPhotoData = (outStream: any, photo: any) => {
    outStream.write(`<p>제목: ${photo.title}</p>`);
    outStream.write(`<p>날짜: ${photo.date}</p>`);
    outStream.write(`<p>위치: ${photo.location}</p>`);
};
const listRecentPhotos = (outStream: any, photos: any) => {
    photos.filter((p: any) => p.date.isAfter(recentDateCutoff()))
        .forEach((p: any) => {
            outStream.write('<div>\n');
            emitPhotoData(outStream, p);
            outStream.write('</div>\n');
        });
};
const renderPerson = (outStream: any, person: any) => {
    outStream.write(`<p>${person.name}</p>\n`);
    renderPhoto(outStream, person.photo);
    emitPhotoData(outStream, person.photo);
};

const photos = [
    {title: '로이사진1', location: '양재천', date: previousDateFromNow(0), url: 'http://abc.com/1'},
    {title: '로이사진2', location: '홍대', date: previousDateFromNow(1), url: 'http://abc.com/2'},
    {title: '로이사진3', location: '이태원', date: previousDateFromNow(2), url: 'http://abc.com/3'},
    {title: '로이사진4', location: '판교', date: previousDateFromNow(3), url: 'http://abc.com/4'},
    {title: '로이사진5', location: '이태원', date: previousDateFromNow(4), url: 'http://abc.com/5'},
    {title: '로이사진6', location: '강남', date: previousDateFromNow(5), url: 'http://abc.com/6'},
    {title: '로이사진7', location: '탄천', date: previousDateFromNow(6), url: 'http://abc.com/7'},
    {title: '로이사진8', location: '잠실새내', date: previousDateFromNow(7), url: 'http://abc.com/8'},
];
const outStream = {
    res: '',
    write(text: string) {
        this.res += text;
    },
};
outStream.write('** renderPerson **\n');
renderPerson(outStream, {name: '제이미', photo: photos[0]});
outStream.write('\n\n** listRecentPhotos **\n');
listRecentPhotos(outStream, photos);
console.log(outStream.res);
