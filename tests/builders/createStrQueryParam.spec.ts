import { createStrQueryParam } from '../../src';

describe('createStrQueryParam', () => {
    it('returns an object with the correct value and onChange function', () => {
        const props = {
            value: 'hello',
            onChange: jest.fn(),
            defaultValue: 'world'
        };
        const result = createStrQueryParam(props);

        expect(result).toEqual({
            value: 'hello',
            onChange: expect.any(Function),
            onReset: expect.any(Function),
            serialize: expect.any(Function)
        });

        // Call the onChange function and check that it passes the value correctly
        result.onChange('new value');
        expect(props.onChange).toHaveBeenCalledWith('new value');

        // Call the onChange function with an array and check that it extracts the first value
        result.onChange(['array value 1', 'array value 2']);
        expect(props.onChange).toHaveBeenCalledWith('array value 1');

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith('world');
    });

    describe('defaultValue', () => {
        it('should be an empty string if defaultValue is not provided', () => {
            const props = {
                value: 'hello',
                onChange: jest.fn()
            };
            const result = createStrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith('');
        });

        it('should be null if nullable is true and defaultValue is not provided', () => {
            const props = {
                value: 'hello',
                onChange: jest.fn(),
                nullable: true
            };
            const result = createStrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be null if both nullable and optional are true and defaultValue is not provided', () => {
            const props = {
                value: 'hello',
                onChange: jest.fn(),
                nullable: true,
                optional: true
            };
            const result = createStrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be undefined if optional is true and defaultValue is not provided', () => {
            const props = {
                value: 'hello',
                onChange: jest.fn(),
                optional: true
            };
            const result = createStrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(undefined);
        });
    });
});
