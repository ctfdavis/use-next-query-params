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
    let onStateChange: jest.Mock;
    let initialQueryParams: NextQueryParams;
    beforeEach(() => {
        onChangeTest1 = jest.fn();
        onChangeTest2 = jest.fn();
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
            }
        };
    });
    describe('initial render', () => {
        it('should trigger `onChange` with query params', () => {
            renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            query: {
                                test1: 'new test1',
                                test2: 'new test2'
                            },
                            onChange: jest.fn()
                        }
                    }
                }
            );
            expect(onChangeTest1).toHaveBeenCalledWith('new test1');
            expect(onChangeTest2).toHaveBeenCalledWith('new test2');
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
                            query: {
                                test1: 'new test1',
                                test2: 'new test2'
                            },
                            onChange: jest.fn()
                        }
                    }
                }
            );
            expect(onChangeTest1).not.toHaveBeenCalled();
            expect(onChangeTest2).not.toHaveBeenCalled();
        });
        it('should not trigger `onChange` without query params', () => {
            renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            query: {},
                            onChange: jest.fn()
                        }
                    }
                }
            );
            expect(onChangeTest1).not.toHaveBeenCalled();
            expect(onChangeTest2).not.toHaveBeenCalled();
        });
    });
    describe('subsequent renders', () => {
        it('should trigger state `onChange` after initial render if query params updated', () => {
            const { rerender } = renderHook(
                ({ queryParams, options }: RenderHookProps) => {
                    useNextQueryParams(queryParams, options);
                },
                {
                    initialProps: {
                        queryParams: initialQueryParams,
                        options: {
                            isRouterReady: true,
                            query: {
                                test1: 'new test1',
                                test2: 'new test2'
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
                    query: {
                        test1: 'new new test1',
                        test2: 'new new test2'
                    },
                    onChange: jest.fn()
                }
            });
            expect(onChangeTest1).toHaveBeenCalledWith('new new test1');
            expect(onChangeTest2).toHaveBeenCalledWith('new new test2');
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
                            query: {},
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
                    }
                },
                options: {
                    isRouterReady: true,
                    query: {},
                    onChange: onStateChange
                }
            });
            expect(onStateChange).toHaveBeenCalledWith({
                test1: 'new test1',
                test2: 'new test2'
            });
        });
        it('should not remove uncontrolled query params', () => {
            renderHook(() => {
                useNextQueryParams(initialQueryParams, {
                    isRouterReady: true,
                    query: {
                        uncontrolled: 'uncontrolled'
                    },
                    onChange: onStateChange
                });
            });
            expect(onStateChange).toHaveBeenCalledWith({
                test1: 'test1',
                test2: 'test2',
                uncontrolled: 'uncontrolled'
            });
        });
        describe('mode: "reset"', () => {
            it('should trigger `onReset` when query param is removed', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            query,
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
                expect(onChangeTest1).not.toHaveBeenCalledWith('default test1');
                expect(onChangeTest2).toHaveBeenCalledWith('default test2');
            });
            it('should not trigger `onReset` when query param is added', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            query,
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
            it('should trigger `onStateChange` when query param is removed', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            query,
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
                expect(onStateChange).toHaveBeenCalledWith({
                    // since we are not updating the state with jest.fn, the default value is used
                    test1: 'test1',
                    test2: 'test2'
                });
            });
        });
        describe('mode: "merge"', () => {
            it('should trigger `onStateChange` when query param is removed', () => {
                const { rerender } = renderHook(
                    (query: ParsedUrlQuery) => {
                        useNextQueryParams(initialQueryParams, {
                            isRouterReady: true,
                            query,
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
                expect(onStateChange).toHaveBeenCalledWith({
                    // since we are not updating the state with jest.fn, the default value is used
                    test1: 'test1',
                    test2: 'test2'
                });
            });
        });
    });
});
