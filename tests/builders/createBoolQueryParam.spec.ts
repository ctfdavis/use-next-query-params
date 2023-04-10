import { createBoolQueryParam } from '../../src';

describe('createBoolQueryParam', () => {
    it('returns an object with the correct value, onChange and serialize', () => {
        const props = {
            value: true,
            onChange: jest.fn(),
            defaultValue: false
        };
        const result = createBoolQueryParam(props);

        expect(result).toEqual({
            value: true,
            onChange: expect.any(Function),
            onReset: expect.any(Function),
            serialize: expect.any(Function)
        });

        // Call the onChange function with "true" and check that it passes true
        result.onChange('true');
        expect(props.onChange).toHaveBeenCalledWith(true);

        // Call the onChange function with "false" and check that it passes false
        result.onChange('false');
        expect(props.onChange).toHaveBeenCalledWith(false);

        // Call the onChange function with "abc" and check that it's ignored
        result.onChange('abc');
        expect(props.onChange).not.toHaveBeenCalledWith('abc');

        // Call the onChange function with an array and check that it extracts the first value correctly
        result.onChange(['true', 'false']);
        expect(props.onChange).toHaveBeenCalledWith(true);

        result.onChange(['false', 'true']);
        expect(props.onChange).toHaveBeenCalledWith(false);

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith(false);

        // Call the serialize function and check that it returns the correct value
        expect(result.serialize?.(true)).toEqual('true');
    });

    describe('defaultValue', () => {
        it('should be false if defaultValue is not provided', () => {
            const props = {
                value: true,
                onChange: jest.fn()
            };
            const result = createBoolQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(false);
        });

        it('should be null if nullable is true and defaultValue is not provided', () => {
            const props = {
                value: true,
                onChange: jest.fn(),
                nullable: true
            };
            const result = createBoolQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be null if both nullable and optional are true and defaultValue is not provided', () => {
            const props = {
                value: true,
                onChange: jest.fn(),
                nullable: true,
                optional: true
            };
            const result = createBoolQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be undefined if optional is true and defaultValue is not provided', () => {
            const props = {
                value: true,
                onChange: jest.fn(),
                optional: true
            };
            const result = createBoolQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(undefined);
        });
    });
});
