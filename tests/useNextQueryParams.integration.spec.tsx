import React from 'react';
import { renderHook } from '@testing-library/react';
import {
    NextQueryParams,
    useNextQueryParams,
    createStrQueryParam,
    createNumQueryParam,
    createBoolQueryParam,
    createObjQueryParam,
    NextQueryParamsAdapter,
    NextQueryParamsProvider
} from '../src';
import { createStrArrQueryParam } from '../src/utils/query/builders/createStrArrQueryParam';
import { createNumArrQueryParam } from '../src/utils/query/builders/createNumArrQueryParam';

type RenderHookProps = {
    queryParams: NextQueryParams;
    adapter?: Partial<NextQueryParamsAdapter>;
};

describe('useNextQueryParams (Integration)', () => {
    let onStateChange: jest.Mock;
    let onStrChange: jest.Mock;
    let onNumChange: jest.Mock;
    let onBoolChange: jest.Mock;
    let onObjChange: jest.Mock;
    let onStrArrChange: jest.Mock;
    let onNumArrChange: jest.Mock;
    let initialRenderHookProps: RenderHookProps;
    let expectOnChangeCalls: (
        str: string,
        num: number,
        bool: boolean,
        obj: object,
        strArr: string[],
        numArr: number[]
    ) => void;
    beforeEach(() => {
        onStateChange = jest.fn();
        onStrChange = jest.fn();
        onNumChange = jest.fn();
        onBoolChange = jest.fn();
        onObjChange = jest.fn();
        onStrArrChange = jest.fn();
        onNumArrChange = jest.fn();
        initialRenderHookProps = {
            queryParams: {
                str: createStrQueryParam({
                    value: 'str',
                    onChange: onStrChange
                }),
                num: createNumQueryParam({
                    value: 0,
                    onChange: onNumChange
                }),
                bool: createBoolQueryParam({
                    value: true,
                    onChange: onBoolChange
                }),
                obj: createObjQueryParam({
                    value: {
                        obj: 'obj'
                    },
                    onChange: onObjChange
                }),
                strArr: createStrArrQueryParam({
                    value: ['strArr'],
                    onChange: onStrArrChange
                }),
                numArr: createNumArrQueryParam({
                    value: [0],
                    onChange: onNumArrChange
                })
            },
            adapter: {
                isRouterReady: true,
                onChange: onStateChange
            }
        };
        expectOnChangeCalls = (str, num, bool, obj, strArr, numArr) => {
            expect(onStrChange).toHaveBeenCalledWith(str);
            expect(onNumChange).toHaveBeenCalledWith(num);
            expect(onBoolChange).toHaveBeenCalledWith(bool);
            expect(onObjChange).toHaveBeenCalledWith(obj);
            expect(onStrArrChange).toHaveBeenCalledWith(strArr);
            expect(onNumArrChange).toHaveBeenCalledWith(numArr);
        };
    });
    describe('without a provider (standalone)', () => {
        describe('not properly set up', () => {
            it('should throw an error', () => {
                expect(() => {
                    renderHook(
                        ({ queryParams }: RenderHookProps) => useNextQueryParams(queryParams, {}),
                        {
                            initialProps: initialRenderHookProps
                        }
                    );
                }).toThrow();
            });
        });
        describe('initial render', () => {
            it('should update state with query params', () => {
                renderHook(
                    ({ queryParams, adapter }: RenderHookProps) =>
                        useNextQueryParams(queryParams, {
                            ...adapter,
                            query: {
                                str: 'new str',
                                num: '0',
                                bool: 'false',
                                obj: '{"obj":"new obj"}',
                                strArr: ['new strArr'],
                                numArr: ['0'],
                                uncontrolled: 'uncontrolled'
                            }
                        }),
                    {
                        initialProps: initialRenderHookProps
                    }
                );
                expectOnChangeCalls('new str', 0, false, { obj: 'new obj' }, ['new strArr'], [0]);
            });
        });
        describe('subsequent renders', () => {
            it('should update query params when state changes', () => {
                renderHook(
                    ({ queryParams, adapter }: RenderHookProps) =>
                        useNextQueryParams(queryParams, {
                            ...adapter,
                            query: {
                                uncontrolled: 'uncontrolled'
                            }
                        }),
                    {
                        initialProps: initialRenderHookProps
                    }
                );
                expect(onStateChange).toHaveBeenCalledWith({
                    str: 'str',
                    num: '0',
                    bool: 'true',
                    obj: '{"obj":"obj"}',
                    strArr: ['strArr'],
                    numArr: ['0'],
                    uncontrolled: 'uncontrolled'
                });
            });
        });
    });
    describe('with a provider', () => {
        describe('initial render', () => {
            it('should update state with query params', () => {
                const wrapper = ({ children }: { children: React.ReactNode }) => (
                    <NextQueryParamsProvider
                        adapter={{
                            isRouterReady: true,
                            onChange: onStateChange,
                            query: {
                                str: 'new str',
                                num: '0',
                                bool: 'false',
                                obj: '{"obj":"new obj"}',
                                strArr: ['new strArr'],
                                numArr: ['0'],
                                uncontrolled: 'uncontrolled'
                            }
                        }}
                    >
                        {children}
                    </NextQueryParamsProvider>
                );
                renderHook(({ queryParams }: RenderHookProps) => useNextQueryParams(queryParams), {
                    initialProps: initialRenderHookProps,
                    wrapper
                });
                expectOnChangeCalls('new str', 0, false, { obj: 'new obj' }, ['new strArr'], [0]);
            });
            it('should update query params when state changes', () => {
                const wrapper = ({ children }: { children: React.ReactNode }) => (
                    <NextQueryParamsProvider
                        adapter={{
                            isRouterReady: true,
                            onChange: onStateChange,
                            query: {
                                uncontrolled: 'uncontrolled'
                            }
                        }}
                    >
                        {children}
                    </NextQueryParamsProvider>
                );
                renderHook(({ queryParams }: RenderHookProps) => useNextQueryParams(queryParams), {
                    initialProps: initialRenderHookProps,
                    wrapper
                });
                expect(onStateChange).toHaveBeenCalledWith({
                    str: 'str',
                    num: '0',
                    bool: 'true',
                    obj: '{"obj":"obj"}',
                    strArr: ['strArr'],
                    numArr: ['0'],
                    uncontrolled: 'uncontrolled'
                });
            });
        });
        describe('subsequent renders', () => {
            it('should update state with query params', () => {
                const wrapper = ({ children }: { children: React.ReactNode }) => (
                    <NextQueryParamsProvider
                        adapter={{
                            isRouterReady: true,
                            onChange: onStateChange,
                            query: {
                                uncontrolled: 'uncontrolled'
                            }
                        }}
                    >
                        {children}
                    </NextQueryParamsProvider>
                );
                renderHook(
                    ({ queryParams, adapter }: RenderHookProps) =>
                        useNextQueryParams(queryParams, {
                            ...adapter,
                            query: {
                                str: 'new str',
                                num: '0',
                                bool: 'false',
                                obj: '{"obj":"new obj"}',
                                strArr: ['new strArr'],
                                numArr: ['0'],
                                uncontrolled: 'uncontrolled'
                            }
                        }),
                    {
                        initialProps: initialRenderHookProps,
                        wrapper
                    }
                );
                expectOnChangeCalls('new str', 0, false, { obj: 'new obj' }, ['new strArr'], [0]);
            });
        });
        describe('overriding context', () => {
            it('should update state with query params', () => {
                const wrapper = ({ children }: { children: React.ReactNode }) => (
                    <NextQueryParamsProvider
                        adapter={{
                            isRouterReady: true,
                            onChange: onStateChange,
                            query: {
                                uncontrolled: 'uncontrolled'
                            }
                        }}
                    >
                        {children}
                    </NextQueryParamsProvider>
                );
                renderHook(
                    ({ queryParams, adapter }: RenderHookProps) =>
                        useNextQueryParams(queryParams, {
                            ...adapter,
                            query: {
                                str: 'new str',
                                num: '456',
                                bool: 'false',
                                obj: '{"obj":"new obj"}',
                                strArr: ['new strArr'],
                                numArr: ['456'],
                                uncontrolled: 'uncontrolled'
                            }
                        }),
                    {
                        initialProps: initialRenderHookProps,
                        wrapper
                    }
                );
                expectOnChangeCalls(
                    'new str',
                    456,
                    false,
                    { obj: 'new obj' },
                    ['new strArr'],
                    [456]
                );
            });
        });
    });
});
