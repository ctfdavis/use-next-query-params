import { getChangedUrlQueryKeys } from '../src/utils/query/getChangedUrlQueryKeys';

describe('getChangedUrlQueryKeys', () => {
    // if totally same, return empty array
    // if some keys missing in former, include those keys
    // if some keys missing in latter, include those keys
    // if some keys are different, include those keys
    // if some keys are same, but their values are different, include those keys
    // make sure to test with array values
    const testCases = [
        { a: {}, b: {}, expected: [] },
        { a: { a: 'a' }, b: { a: 'a' }, expected: [] },
        { a: { a: 'a' }, b: { a: 'b' }, expected: ['a'] },
        { a: { a: 'a' }, b: { b: 'a' }, expected: ['a', 'b'] },
        { a: { a: 'a' }, b: { a: 'a', b: 'b' }, expected: ['b'] },
        { a: { a: 'a', b: 'b' }, b: { a: 'a' }, expected: ['b'] },
        { a: { a: 'a', b: 'b' }, b: { a: 'a', b: 'b' }, expected: [] },
        { a: { a: 'a', b: 'b' }, b: { a: 'a', b: 'c' }, expected: ['b'] },
        { a: { a: 'a', b: 'b' }, b: { a: 'a', b: ['b'] }, expected: ['b'] },
        { a: { a: 'a', b: ['b'] }, b: { a: 'a', b: 'b' }, expected: ['b'] },
        { a: { a: 'a', b: ['b'] }, b: { a: 'a', b: ['b'] }, expected: [] },
        { a: { a: 'a', b: ['b'] }, b: { a: 'a', b: ['c'] }, expected: ['b'] },
        { a: { a: 'a', b: ['b', 'c'] }, b: { a: 'a', b: ['b', 'c'] }, expected: [] },
        { a: { a: 'a', b: ['b', 'c'] }, b: { a: 'a', b: ['c', 'b'] }, expected: ['b'] },
        { a: { a: 'a', b: ['b', 'c'] }, b: { a: 'a', b: ['b'] }, expected: ['b'] },
        { a: { a: 'a', b: ['b'] }, b: { a: 'a', b: ['b', 'c'] }, expected: ['b'] }
    ];
    it.each(testCases)('should return $expected when comparing $a and $b', ({ a, b, expected }) => {
        expect(getChangedUrlQueryKeys(a, b)).toEqual(expected);
    });
});
