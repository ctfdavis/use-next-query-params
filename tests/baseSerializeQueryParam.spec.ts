import { baseSerializeQueryParam } from '../src/utils/query/baseSerializeQueryParam';

describe('baseSerializeQueryParam', () => {
    describe('primitives', () => {
        const stringTestCases = [
            {
                value: 'testing',
                expected: 'testing'
            },
            {
                value: '',
                expected: ''
            }
        ];
        it.each(stringTestCases)('should serialize string', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toBe(expected);
        });

        const numberTestCases = [
            {
                value: 1,
                expected: '1'
            },
            {
                value: 0,
                expected: '0'
            },
            {
                value: -1,
                expected: '-1'
            },
            {
                value: Infinity,
                expected: 'Infinity'
            },
            {
                value: -Infinity,
                expected: '-Infinity'
            }
        ];
        it.each(numberTestCases)('should serialize number', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toBe(expected);
        });

        const booleanTestCases = [
            {
                value: true,
                expected: 'true'
            },
            {
                value: false,
                expected: 'false'
            }
        ];
        it.each(booleanTestCases)('should serialize boolean', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toBe(expected);
        });
    });

    describe('invalid values', () => {
        const testCases = [
            {
                value: undefined,
                expected: undefined
            },
            {
                value: null,
                expected: undefined
            },
            {
                value: NaN,
                expected: undefined
            },
            {
                value: new Map([
                    ['apples', 500],
                    ['bananas', 300],
                    ['oranges', 200]
                ]),
                expected: undefined
            },
            {
                value: new Set(),
                expected: undefined
            },
            {
                value: () => {},
                expected: undefined
            },
            {
                value: function () {},
                expected: undefined
            },
            {
                value: console.log,
                expected: undefined
            },
            {
                value: Symbol('test'),
                expected: undefined
            },
            {
                value: new WeakMap(),
                expected: undefined
            },
            {
                value: new WeakSet(),
                expected: undefined
            },
            {
                value: new RegExp('test'),
                expected: undefined
            },
            {
                value: new FileReader(),
                expected: undefined
            }
        ];
        it.each(testCases)(
            'should return undefined for invalid values $value',
            ({ value, expected }) => {
                const actual = baseSerializeQueryParam(value);
                expect(actual).toBe(expected);
            }
        );
    });

    describe('arrays', () => {
        const simpleArrayTestCases = [
            {
                value: ['test1', 'test2'],
                expected: ['test1', 'test2']
            },
            {
                value: [],
                expected: []
            },
            {
                value: [1, 2, 3],
                expected: ['1', '2', '3']
            },
            {
                value: [true, false],
                expected: ['true', 'false']
            },
            {
                value: [1, 'test', true],
                expected: ['1', 'test', 'true']
            }
        ];
        it.each(simpleArrayTestCases)('should serialize simple array', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toStrictEqual(expected);
        });

        const nestedArrayTestCases = [
            {
                value: [
                    ['test1', 'test2'],
                    ['test3', 'test4']
                ],
                expected: ['["test1","test2"]', '["test3","test4"]']
            },
            {
                value: [
                    [1, 2, 3],
                    [4, 5, 6]
                ],
                expected: ['[1,2,3]', '[4,5,6]']
            },
            {
                value: [
                    [true, false],
                    [true, false]
                ],
                expected: ['[true,false]', '[true,false]']
            },
            {
                value: [
                    [1, 'test', true],
                    [1, 'test', true]
                ],
                expected: ['[1,"test",true]', '[1,"test",true]']
            }
        ];

        it.each(nestedArrayTestCases)('should serialize nested array', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toStrictEqual(expected);
        });

        const objectArrayTestCases = [
            {
                value: [{ a: 'test1' }, { a: 'test2' }],
                expected: ['{"a":"test1"}', '{"a":"test2"}']
            },
            {
                value: [{ a: 1 }, { a: 2 }],
                expected: ['{"a":1}', '{"a":2}']
            }
        ];

        it.each(objectArrayTestCases)('should serialize object array', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toStrictEqual(expected);
        });

        const invalidArrayTestCases = [
            {
                value: [undefined, null, NaN],
                expected: []
            },
            {
                value: [undefined, null, NaN, 1, 'test', true],
                expected: ['1', 'test', 'true']
            },
            {
                value: [undefined, null, NaN, [1, 2, 3], ['test1', 'test2'], null, undefined],
                expected: ['[1,2,3]', '["test1","test2"]']
            }
        ];
        it.each(invalidArrayTestCases)('should serialize invalid array', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('dates', () => {
        const dateTestCases = [
            {
                value: new Date('2020-01-01'),
                expected: '2020-01-01T00:00:00.000Z'
            },
            {
                value: new Date('1999-12-31T23:59:59.999Z'),
                expected: '1999-12-31T23:59:59.999Z'
            }
        ];
        it.each(dateTestCases)('should serialize date', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toBe(expected);
        });
    });

    describe('objects', () => {
        const objectTestCases = [
            {
                value: { a: 'test1', b: 1, c: true },
                expected: '{"a":"test1","b":1,"c":true}'
            },
            {
                value: {},
                expected: '{}'
            }
        ];
        it.each(objectTestCases)('should serialize simple object', ({ value, expected }) => {
            const actual = baseSerializeQueryParam(value);
            expect(actual).toBe(expected);
        });

        const invalidObjectTestCases = [
            {
                value: { a: undefined, b: null, c: NaN },
                expected: '{"b":null,"c":"NaN"}'
            },
            {
                value: { a: undefined, b: null, c: NaN, d: 1, e: 'test', f: true },
                expected: '{"b":null,"c":"NaN","d":1,"e":"test","f":true}'
            },
            {
                value: {
                    a: 'test1',
                    b: 1,
                    c: true,
                    d: undefined,
                    e: null,
                    f: NaN,
                    g: Infinity,
                    h: -Infinity
                },
                expected:
                    '{"a":"test1","b":1,"c":true,"e":null,"f":"NaN","g":"Infinity","h":"-Infinity"}'
            },
            {
                value: {
                    a: () => {},
                    b: function () {},
                    c: console.log,
                    d: Symbol('test'),
                    e: new Date('2020-01-01'),
                    f: [1, 2, 3],
                    g: new Map(),
                    h: new Set(),
                    i: new WeakMap(),
                    j: new WeakSet(),
                    k: new Error('test'),
                    l: new RegExp('test')
                },
                expected: '{"e":"2020-01-01T00:00:00.000Z","f":[1,2,3]}'
            }
        ];
        it.each(invalidObjectTestCases)(
            'should serialize invalid object',
            ({ value, expected }) => {
                const actual = baseSerializeQueryParam(value);
                expect(actual).toBe(expected);
            }
        );
    });
});
