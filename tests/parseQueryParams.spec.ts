import { parseQueryParams } from '../src/utils/query/parseQueryParams';

describe('parseQueryParams', () => {
    describe('empty object return', () => {
        it('should return empty object when no query params are provided', () => {
            expect(parseQueryParams({})).toStrictEqual({});
        });
        it('should return empty object when query params with undefined values are provided', () => {
            expect(parseQueryParams({ test1: undefined, test2: undefined })).toStrictEqual({});
        });
        it('should return empty object when query params with null values are provided', () => {
            expect(parseQueryParams({ test1: null, test2: null })).toStrictEqual({});
        });
    });
    describe('non-empty object return', () => {
        const testCases = [
            {
                values: {
                    test1: 'test1',
                    test2: 'test2'
                },
                expected: {
                    test1: 'test1',
                    test2: 'test2'
                }
            },
            {
                values: {
                    test1: true,
                    test2: false
                },
                expected: {
                    test1: 'true',
                    test2: 'false'
                }
            },
            {
                values: {
                    test1: 1,
                    test2: 2
                },
                expected: {
                    test1: '1',
                    test2: '2'
                }
            },
            {
                values: {
                    test1: ['apple', 'banana'],
                    test2: ['test2']
                },
                expected: {
                    test1: ['apple', 'banana'],
                    test2: ['test2']
                }
            },
            {
                values: {
                    test1: [1, 2, 3],
                    test2: 'test2'
                },
                expected: {
                    test1: ['1', '2', '3'],
                    test2: 'test2'
                }
            },
            {
                values: {
                    test1: {
                        test1: 'test1',
                        test2: 2
                    },
                    test2: 'test2'
                },
                expected: {
                    test1: JSON.stringify({ test1: 'test1', test2: 2 }),
                    test2: 'test2'
                }
            },
            {
                values: {
                    test1: ['apple', 'banana', null, undefined],
                    test2: [null, undefined]
                },
                expected: {
                    test1: ['apple', 'banana'],
                    test2: []
                }
            }
        ];

        it.each(testCases)(
            'should return object with query params when query params with values are provided',
            ({ values, expected }) => {
                expect(parseQueryParams(values)).toStrictEqual(expected);
            }
        );
    });
});
