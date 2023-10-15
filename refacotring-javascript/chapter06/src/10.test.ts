import {enrichReading} from './10';
import _ from 'lodash';

it('check reading unchanged ', () => {
    const baseReading = {customer: 'ivan', quantity: 15, month: 5, year: 2017};
    const oracle = _.cloneDeep(baseReading);
    enrichReading(baseReading);
    expect(baseReading).toEqual(oracle);
});
