import { areUrlQueriesEqual } from '../src/utils/query/areUrlQueriesEqual';

describe('areQueryParamsEqual', () => {
    const testCases = [
        {
            a: {
                test1: 'test1',
                test2: 'test2'
            },
            b: {
                test1: 'test1',
                test2: 'test2'
            },
            expected: true
        },
        {
            a: {
                test1: 'test1',
                test2: 'test2'
            },
            b: {
                test1: 'test1',
                test2: 'test3'
            },
            expected: false
        },
        {
            a: {
                test1: 'test1',
                test2: 'test2'
            },
            b: {
                test1: 'test1'
            },
            expected: false
        },
        {
            a: {
                test1: 'test1',
                test2: ['test2', 'test3']
            },
            b: {
                test1: 'test1',
                test2: ['test2', 'test3']
            },
            expected: true
        },
        {
            a: {
                test1: 'test1',
                test2: ['test2', 'test3']
            },
            b: {
                test1: 'test1',
                test2: ['test3', 'test2']
            },
            expected: false
        },
        {
            a: {},
            b: {},
            expected: true
        },
        {
            a: {
                test1: 'test1'
            },
            b: {},
            expected: false
        }
    ];

    test.each(testCases)('should return %p when comparing %p and %p', ({ a, b, expected }) => {
        expect(areUrlQueriesEqual(a, b)).toBe(expected);
    });
});
