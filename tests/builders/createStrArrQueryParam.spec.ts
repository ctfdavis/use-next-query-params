import { createStrArrQueryParam } from '../../src';

describe('createStrArrQueryParam', () => {
    it('returns an object with the correct value and onChange function', () => {
        const props = {
            value: ['hello', 'world'],
            onChange: jest.fn(),
            defaultValue: ['foo', 'bar']
        };
        const result = createStrArrQueryParam(props);

        expect(result).toEqual({
            value: ['hello', 'world'],
            onChange: expect.any(Function),
            onReset: expect.any(Function)
        });

        // Call the onChange function with an array and check that it passes the value correctly
        result.onChange(['foo', 'bar']);
        expect(props.onChange).toHaveBeenCalledWith(['foo', 'bar']);

        // Call the onChange function with a single value and check that it converts it to an array
        result.onChange('baz');
        expect(props.onChange).toHaveBeenCalledWith(['baz']);

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith(['foo', 'bar']);
    });

    it('sets default value to an empty array if defaultValue is not provided', () => {
        const props = {
            value: ['hello', 'world'],
            onChange: jest.fn()
        };
        const result = createStrArrQueryParam(props);

        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith([]);
    });
});
