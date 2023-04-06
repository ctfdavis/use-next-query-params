import { renderHook } from '@testing-library/react';
import { NextQueryParams, NextQueryParamsAdapter, useNextQueryParams } from '../src';

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
                defaultValue: 'default test1'
            },
            test2: {
                value: 'test2',
                onChange: onChangeTest2,
                defaultValue: 'default test2'
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
                        defaultValue: 'default test1'
                    },
                    test2: {
                        value: 'new test2',
                        onChange: onChangeTest2,
                        defaultValue: 'default test2'
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
    });
});
