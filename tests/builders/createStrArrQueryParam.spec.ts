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

    describe('defaultValue', () => {
        it('should be an empty array if defaultValue is not provided', () => {
            const props = {
                value: ['hello', 'world'],
                onChange: jest.fn()
            };
            const result = createStrArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith([]);
        });

        it('should be null if nullable is true and defaultValue is not provided', () => {
            const props = {
                value: ['hello', 'world'],
                onChange: jest.fn(),
                nullable: true
            };
            const result = createStrArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be null if both nullable and optional are true and defaultValue is not provided', () => {
            const props = {
                value: ['hello', 'world'],
                onChange: jest.fn(),
                nullable: true,
                optional: true
            };
            const result = createStrArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be undefined if optional is true and defaultValue is not provided', () => {
            const props = {
                value: ['hello', 'world'],
                onChange: jest.fn(),
                optional: true
            };
            const result = createStrArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(undefined);
        });
    });
});
