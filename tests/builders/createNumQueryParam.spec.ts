import { createNumQueryParam } from '../../src';

describe('createNumQueryParam', () => {
    it('returns an object with the correct value and onChange function', () => {
        const props = {
            value: 123,
            onChange: jest.fn(),
            defaultValue: 456
        };
        const result = createNumQueryParam(props);

        expect(result).toEqual({
            value: 123,
            onChange: expect.any(Function),
            onReset: expect.any(Function)
        });

        // Call the onChange function with a numeric value and check that it passes the value correctly
        result.onChange('456');
        expect(props.onChange).toHaveBeenCalledWith(456);

        // Call the onChange function with a non-numeric value and check that it's ignored
        result.onChange('abc');
        expect(props.onChange).not.toHaveBeenCalledWith('abc');

        // Call the onChange function with an array and check that it extracts the first numeric value
        result.onChange(['789', 'xyz']);
        expect(props.onChange).toHaveBeenCalledWith(789);

        // Call the onChange function with an array of non-numeric values and check that it's ignored
        result.onChange(['abc', 'def']);
        expect(props.onChange).not.toHaveBeenCalledWith('abc');

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith(456);
    });

    describe('defaultValue', () => {
        it('should be 0 if defaultValue is not provided', () => {
            const props = {
                value: 123,
                onChange: jest.fn()
            };
            const result = createNumQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(0);
        });

        it('should be null if nullable is true and defaultValue is not provided', () => {
            const props = {
                value: 123,
                onChange: jest.fn(),
                nullable: true
            };
            const result = createNumQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be undefined if optional is true and defaultValue is not provided', () => {
            const props = {
                value: 123,
                onChange: jest.fn(),
                optional: true
            };
            const result = createNumQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(undefined);
        });

        it('should be null if nullable and optional are true and defaultValue is not provided', () => {
            const props = {
                value: 123,
                onChange: jest.fn(),
                nullable: true,
                optional: true
            };
            const result = createNumQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });
    });
});
