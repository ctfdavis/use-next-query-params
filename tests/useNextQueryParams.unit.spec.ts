import { renderHook } from '@testing-library/react';
import { NextQueryParams, NextQueryParamsAdapter, useNextQueryParams } from '../src';
import { ParsedUrlQuery } from 'querystring';

interface RenderHookProps {
    queryParams: NextQueryParams;
    options?: Partial<NextQueryParamsAdapter>;
}

describe('useNextQueryParams (Unit)', () => {
    let onChangeTest1: jest.Mock;
    let onChangeTest2: jest.Mock;
    let onChangeTest3: jest.Mock;
    let onStateChange: jest.Mock;
    let initialQueryParams: NextQueryParams;
    beforeEach(() => {
        onChangeTest1 = jest.fn();
        onChangeTest2 = jest.fn();
        onChangeTest3 = jest.fn();
        onStateChange = jest.fn();
        initialQueryParams = {
            test1: {
                value: 'test1',
                onChange: onChangeTest1,
                onReset: () => onChangeTest1('default test1')
            },
            test2: {
                value: 'test2',
                onChange: onChangeTest2,
                onReset: () => onChangeTest2('default test2')
            },
            test3: {
                value: [{ obj: 'obj' }],
                onChange: onChangeTest3,
                onReset: () => onChangeTest3({ obj: 'obj' })
            }
        };
    });
    describe('initial render', () => {
        it('should trigger `onChange` with urlQuery params', () => {
            renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            urlQuery: {
                                test1: 'new test1',
                                test2: 'new test2',
                                test3: ['{"obj":"newObj"}']
                            },
                            onChange: jest.fn()
                        }
                    }
                }
            );
            expect(onChangeTest1).toHaveBeenCalledWith('new test1');
            expect(onChangeTest2).toHaveBeenCalledWith('new test2');
            expect(onChangeTest3).toHaveBeenCalledWith(['{"obj":"newObj"}']);
        });
        it('should not trigger `onChange` when router is not ready', () => {
            renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: false,
                            urlQuery: {
                                test1: 'new test1',
                                test2: 'new test2',
                                test3: ['{"obj":"newObj"}']
                            },
                            onChange: jest.fn()
                        }
                    }
                }
            );
            expect(onChangeTest1).not.toHaveBeenCalled();
            expect(onChangeTest2).not.toHaveBeenCalled();
            expect(onChangeTest3).not.toHaveBeenCalled();
        });
        it('should not trigger `onChange` without urlQuery params', () => {
            renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            urlQuery: {},
                            onChange: jest.fn()
                        }
                    }
                }
            );
            expect(onChangeTest1).not.toHaveBeenCalled();
            expect(onChangeTest2).not.toHaveBeenCalled();
            expect(onChangeTest3).not.toHaveBeenCalled();
        });
    });
    describe('subsequent renders', () => {
        it('should trigger state `onChange` after initial render if urlQuery params updated', () => {
            const { rerender } = renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            urlQuery: {
                                test1: 'new test1',
                                test2: 'new test2',
                                test3: ['{"obj":"newObj"}']
                            },
                            onChange: jest.fn()
                        }
                    }
                }
            );
            rerender({
                queryParams: initialQueryParams,
                options: {
                    isRouterReady: true,
                    urlQuery: {
                        test1: 'new new test1',
                        test2: 'new new test2',
                        test3: ['{"obj":"newnewObj"}']
                    },
                    onChange: jest.fn()
                }
            });
            expect(onChangeTest1).toHaveBeenCalledWith('new new test1');
            expect(onChangeTest2).toHaveBeenCalledWith('new new test2');
            expect(onChangeTest3).toHaveBeenCalledWith(['{"obj":"newnewObj"}']);
        });
        it('should trigger `onStateChange` when state change', () => {
            const { rerender } = renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            urlQuery: {},
                            onChange: jest.fn()
                        }
                    }
                }
            );
            rerender({
                queryParams: {
                    test1: {
                        value: 'new test1',
                        onChange: onChangeTest1,
                        onReset: () => onChangeTest1('default test1')
                    },
                    test2: {
                        value: 'new test2',
                        onChange: onChangeTest2,
                        onReset: () => onChangeTest2('default test2')
                    },
                    test3: {
                        value: [{ obj: 'newObj' }],
                        onChange: onChangeTest3,
                        onReset: () => onChangeTest3({ obj: 'obj' })
                    }
                },
                options: {
                    isRouterReady: true,
                    urlQuery: {
                        test1: 'test1',
                        test2: 'test2',
                        test3: ['{"obj":"obj"}']
                    },
                    onChange: onStateChange
                }
            });
            expect(onStateChange).toHaveBeenCalledWith(
                {
                    test1: 'new test1',
                    test2: 'new test2',
                    test3: ['{"obj":"newObj"}']
                },
                true
            );
        });
        it('should remove controlled urlQuery params when state values become invalid', () => {
            const { rerender } = renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            urlQuery: {
                                test1: 'test1',
                                test2: 'test2',
                                test3: ['{"obj":"obj"}']
                            },
                            onChange: jest.fn()
                        }
                    }
                }
            );
            rerender({
                queryParams: {
                    test1: {
                        value: undefined,
                        onChange: onChangeTest1,
                        onReset: () => onChangeTest1('default test1')
                    },
                    test2: {
                        value: null,
                        onChange: onChangeTest2,
                        onReset: () => onChangeTest2('default test2')
                    },
                    test3: {
                        value: [{ obj: 'newObj' }],
                        onChange: onChangeTest3,
                        onReset: () => onChangeTest3({ obj: 'obj' })
                    }
                },
                options: {
                    isRouterReady: true,
                    urlQuery: {
                        test1: 'test1',
                        test2: 'test2',
                        test3: ['{"obj":"obj"}']
                    },
                    onChange: onStateChange
                }
            });
            expect(onStateChange).toHaveBeenCalledWith(
                {
                    test3: ['{"obj":"newObj"}']
                },
                false
            );
        });
        it('should not remove uncontrolled urlQuery params', () => {
            renderHook(() => {
                useNextQueryParams(initialQueryParams, {
                    isRouterReady: true,
                    urlQuery: {
                        uncontrolled: 'uncontrolled'
                    },
                    onChange: onStateChange
                });
            });
            expect(onStateChange).toHaveBeenCalledWith(
                {
                    test1: 'test1',
                    test2: 'test2',
                    test3: ['{"obj":"obj"}'],
                    uncontrolled: 'uncontrolled'
                },
                true
            );
        });
        describe('mode: "reset"', () => {
            it('should trigger `onReset` when urlQuery param is removed', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            urlQuery: query,
                            onChange: onStateChange,
                            mode: 'reset'
                        });
                    },
                    {
                        initialProps: {
                            test1: 'new test1',
                            test2: 'new test2',
                            test3: ['{"obj":"newObj"}']
                        } as ParsedUrlQuery
                    }
                );
                rerender({
                    test1: 'new test1'
                });
                expect(onChangeTest1).not.toHaveBeenCalledWith('default test1');
                expect(onChangeTest2).toHaveBeenCalledWith('default test2');
            });
            it('should not trigger `onReset` when urlQuery param is added', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            urlQuery: query,
                            onChange: onStateChange,
                            mode: 'reset'
                        });
                    },
                    {
                        initialProps: {
                            test1: 'new test1',
                            test2: 'new test2'
                        } as ParsedUrlQuery
                    }
                );
                rerender({
                    test1: 'new test1',
                    test2: 'new test2',
                    test3: 'new test3'
                });
                expect(onChangeTest1).not.toHaveBeenCalledWith('default test1');
                expect(onChangeTest2).not.toHaveBeenCalledWith('default test2');
            });
            it('should trigger `onStateChange` when urlQuery param is removed', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            urlQuery: query,
                            onChange: onStateChange,
                            mode: 'reset'
                        });
                    },
                    {
                        initialProps: {
                            test1: 'new test1',
                            test2: 'new test2'
                        } as ParsedUrlQuery
                    }
                );
                rerender({
                    test1: 'new test1'
                });
                expect(onStateChange).toHaveBeenCalledWith(
                    {
                        // since we are not updating the state with jest.fn, the default value is used
                        test1: 'test1',
                        test2: 'test2',
                        test3: ['{"obj":"obj"}']
                    },
                    true
                );
            });
        });
        describe('mode: "merge"', () => {
            it('should trigger `onStateChange` when urlQuery param is removed', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            urlQuery: query,
                            onChange: onStateChange,
                            mode: 'merge'
                        });
                    },
                    {
                        initialProps: {
                            test1: 'new test1',
                            test2: 'new test2'
                        } as ParsedUrlQuery
                    }
                );
                rerender({
                    test1: 'new test1'
                });
                expect(onStateChange).toHaveBeenCalledWith(
                    {
                        // since we are not updating the state with jest.fn, the default value is used
                        test1: 'test1',
                        test2: 'test2',
                        test3: ['{"obj":"obj"}']
                    },
                    true
                );
            });
        });
    });
});
