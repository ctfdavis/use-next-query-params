import { createNumArrQueryParam } from '../../src';

describe('createNumArrQueryParam', () => {
    it('returns an object with the correct value and onChange function', () => {
        const props = {
            value: [1, 2, 3],
            onChange: jest.fn(),
            defaultValue: [4, 5, 6]
        };
        const result = createNumArrQueryParam(props);

        expect(result).toEqual({
            value: [1, 2, 3],
            onChange: expect.any(Function),
            onReset: expect.any(Function)
        });

        // Call the onChange function and check that it passes the value correctly
        result.onChange(['4', '5', '6', '7']);
        expect(props.onChange).toHaveBeenCalledWith([4, 5, 6, 7]);

        // Call the onChange function with a non-numeric value and check that it's ignored
        result.onChange(['4', '5', '6', 'abc']);
        expect(props.onChange).toHaveBeenCalledWith([4, 5, 6]);

        // Call the onChange function with a single numeric value and check that it's converted to an array
        result.onChange('123');
        expect(props.onChange).toHaveBeenCalledWith([123]);

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith([4, 5, 6]);
    });

    describe('defaultValue', () => {
        it('should be an empty array if defaultValue is not provided', () => {
            const props = {
                value: [1, 2, 3],
                onChange: jest.fn()
            };
            const result = createNumArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith([]);
        });

        it('should be null if nullable is true and defaultValue is not provided', () => {
            const props = {
                value: [1, 2, 3],
                onChange: jest.fn(),
                nullable: true
            };
            const result = createNumArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be null if both nullable and optional are true and defaultValue is not provided', () => {
            const props = {
                value: [1, 2, 3],
                onChange: jest.fn(),
                nullable: true,
                optional: true
            };
            const result = createNumArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(null);
        });

        it('should be undefined if optional is true and defaultValue is not provided', () => {
            const props = {
                value: [1, 2, 3],
                onChange: jest.fn(),
                optional: true
            };
            const result = createNumArrQueryParam(props);

            result.onReset();
            expect(props.onChange).toHaveBeenCalledWith(undefined);
        });
    });
    describe('custom deserialize function', () => {
        it('should call `onChange` with custom deserialize function', () => {
            const props = {
                value: [1, 2, 3],
                onChange: jest.fn(),
                deserialize: (v: string | string[]) => [4, 5, 6]
            };
            const result = createNumArrQueryParam(props);

            result.onChange('2020-01-03');
            expect(props.onChange).toHaveBeenCalledWith([4, 5, 6]);
        });
    });
});
