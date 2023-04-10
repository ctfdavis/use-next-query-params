import { areUrlQueryValuesEqual } from '../src/utils/query/areUrlQueryValuesEqual';

describe('areQueryParamValuesEqual', () => {
    const testCases = [
        { a: 'a', b: 'a', expected: true },
        { a: 'a', b: 'b', expected: false },
        { a: ['a'], b: ['a'], expected: true },
        { a: ['a'], b: ['b'], expected: false },
        { a: ['a', 'b'], b: ['a', 'b'], expected: true },
        { a: ['a', 'b'], b: ['b', 'a'], expected: false },
        { a: ['a', 'b'], b: ['a'], expected: false },
        { a: ['a'], b: ['a', 'b'], expected: false },
        { a: ['a'], b: 'a', expected: false },
        { a: 'a', b: ['a'], expected: false }
    ];
    test.each(testCases)('should return %p when comparing %p and %p', ({ a, b, expected }) => {
        expect(areUrlQueryValuesEqual(a, b)).toBe(expected);
    });
});
