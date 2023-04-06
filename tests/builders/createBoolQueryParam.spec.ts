import { createBoolQueryParam } from '../../src';

describe('createBoolQueryParam', () => {
    it('returns an object with the correct value and onChange function', () => {
        const props = {
            value: true,
            onChange: jest.fn(),
            defaultValue: false
        };
        const result = createBoolQueryParam(props);

        expect(result).toEqual({
            value: true,
            onChange: expect.any(Function),
            onReset: expect.any(Function)
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
    });

    it('sets default value to false if defaultValue is not provided', () => {
        const props = {
            value: true,
            onChange: jest.fn()
        };
        const result = createBoolQueryParam(props);

        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith(false);
    });
});
