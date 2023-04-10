import { serializeQueryParamStates } from '../src/utils/query/serializeQueryParamStates';

describe('serializeQueryParamStates', () => {
    describe('empty object return', () => {
        it('should return empty object when no urlQuery params are provided', () => {
            expect(serializeQueryParamStates({})).toStrictEqual({});
        });
        it('should return empty object when urlQuery params with undefined values are provided', () => {
            expect(
                serializeQueryParamStates({
                    test1: { value: undefined },
                    test2: { value: undefined }
                })
            ).toStrictEqual({});
        });
        it('should return empty object when urlQuery params with null values are provided', () => {
            expect(
                serializeQueryParamStates({ test1: { value: null }, test2: { value: null } })
            ).toStrictEqual({});
        });
    });
    describe('non-empty object return', () => {
        const testCases = [
            {
                values: {
                    test1: {
                        value: 'test1'
                    },
                    test2: {
                        value: 'test2'
                    }
                },
                expected: {
                    test1: 'test1',
                    test2: 'test2'
                }
            },
            {
                values: {
                    test1: {
                        value: true
                    },
                    test2: {
                        value: false
                    }
                },
                expected: {
                    test1: 'true',
                    test2: 'false'
                }
            },
            {
                values: {
                    test1: {
                        value: 1
                    },
                    test2: {
                        value: 2
                    }
                },
                expected: {
                    test1: '1',
                    test2: '2'
                }
            },
            {
                values: {
                    test1: {
                        value: ['apple', 'banana']
                    },
                    test2: {
                        value: ['test2']
                    }
                },
                expected: {
                    test1: ['apple', 'banana'],
                    test2: ['test2']
                }
            },
            {
                values: {
                    test1: {
                        value: [1, 2, 3]
                    },
                    test2: {
                        value: 'test2'
                    }
                },
                expected: {
                    test1: ['1', '2', '3'],
                    test2: 'test2'
                }
            },
            {
                values: {
                    test1: {
                        value: {
                            test1: 'test1',
                            test2: 2
                        }
                    },
                    test2: { value: 'test2' }
                },
                expected: {
                    test1: JSON.stringify({ test1: 'test1', test2: 2 }),
                    test2: 'test2'
                }
            },
            {
                values: {
                    test1: { value: ['apple', 'banana', null, undefined] },
                    test2: { value: [null, undefined] }
                },
                expected: {
                    test1: ['apple', 'banana'],
                    test2: []
                }
            }
        ];

        it.each(testCases)(
            'should return object with urlQuery params when urlQuery params with values are provided',
            ({ values, expected }) => {
                expect(serializeQueryParamStates(values)).toStrictEqual(expected);
            }
        );
    });
    describe('custom serialize function', () => {
        it('should return empty strings for all values when serialize function returns empty string', () => {
            const values = {
                test1: {
                    value: 'test1',
                    serialize: () => ''
                },
                test2: {
                    value: 'test2',
                    serialize: () => ''
                }
            };
            expect(serializeQueryParamStates(values)).toStrictEqual({
                test1: '',
                test2: ''
            });
        });
    });
});
