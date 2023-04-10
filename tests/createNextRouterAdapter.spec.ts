import { createNextRouterAdapter } from '../src';
import { NextRouterAdapterOptions } from '../src/types/NextRouterAdapterOptions';
import mockRouter from 'next-router-mock';

describe('createNextRouterAdapter', () => {
    it('returns a NextQueryParamsAdapter with correct default properties', () => {
        const adapter = createNextRouterAdapter(mockRouter);

        expect(adapter.isRouterReady).toBe(true);
        expect(adapter.urlQuery).toEqual({});
        expect(adapter.mode).toBeUndefined();
        expect(adapter.onChange).toBeInstanceOf(Function);
    });

    it('uses custom onChange when provided', () => {
        const customOnChange = jest.fn();
        const options: NextRouterAdapterOptions = { onChange: customOnChange };
        const adapter = createNextRouterAdapter(mockRouter, options);

        adapter.onChange({ test: 'value' }, false);

        expect(customOnChange).toHaveBeenCalledWith({ test: 'value' }, false);
    });

    it('calls router.push by default on onChange', () => {
        jest.spyOn(mockRouter, 'push');
        const adapter = createNextRouterAdapter(mockRouter);

        adapter.onChange({ test: 'value' }, false);

        expect(mockRouter.push).toHaveBeenCalledWith(
            {
                pathname: '',
                query: { test: 'value' }
            },
            undefined,
            { shallow: false }
        );
    });

    it('calls router.replace when replace option is set', () => {
        jest.spyOn(mockRouter, 'replace');
        const options: NextRouterAdapterOptions = { replace: true };
        const adapter = createNextRouterAdapter(mockRouter, options);

        adapter.onChange({ test: 'value' }, false);

        expect(mockRouter.replace).toHaveBeenCalledWith(
            {
                pathname: '',
                query: { test: 'value' }
            },
            undefined,
            { shallow: false }
        );
    });

    it('respects the shallow option', () => {
        jest.spyOn(mockRouter, 'push');
        const options: NextRouterAdapterOptions = { shallow: true };
        const adapter = createNextRouterAdapter(mockRouter, options);

        adapter.onChange({ test: 'value' }, false);

        expect(mockRouter.push).toHaveBeenCalledWith(
            {
                pathname: '',
                query: { test: 'value' }
            },
            undefined,
            { shallow: true }
        );
    });

    it('should use replace when isTriggeredByUrl is true', () => {
        jest.spyOn(mockRouter, 'replace');
        const adapter = createNextRouterAdapter(mockRouter);

        adapter.onChange({ test: 'value' }, true);

        expect(mockRouter.replace).toHaveBeenCalledWith(
            {
                pathname: '',
                query: { test: 'value' }
            },
            undefined,
            { shallow: false }
        );
    });
});
