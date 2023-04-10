import { createDateQueryParam } from '../../src/utils/query/builders/createDateQueryParam';

describe('createDateQueryParam', () => {
    it('returns an object with the correct value, onChange and serialize functions', () => {
        const props = {
            value: new Date('2020-01-01'),
            onChange: jest.fn(),
            defaultValue: new Date('2020-01-02')
        };
        const result = createDateQueryParam(props);

        expect(result).toEqual({
            serialize: expect.any(Function),
            value: new Date('2020-01-01'),
            onChange: expect.any(Function),
            onReset: expect.any(Function)
        });

        // Call the onChange function with a date and check that it passes the value correctly
        result.onChange('2020-01-03');
        expect(props.onChange).toHaveBeenCalledWith(new Date('2020-01-03'));

        // Call the onChange function with an array and check that it extracts the first value correctly
        result.onChange(['2020-01-04', '2020-01-05']);
        expect(props.onChange).toHaveBeenCalledWith(new Date('2020-01-04'));

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith(new Date('2020-01-02'));

        // Call the serialize function and check that it returns the correct value
        expect(result.serialize?.(new Date('2020-01-03'))).toEqual('2020-01-03');
        expect(result.serialize?.(new Date('2020-01-03T12:00:00'))).toEqual('2020-01-03');
    });
    it('returns an object with the serialize function when withTime is true', () => {
        const props = {
            value: new Date('2020-01-01'),
            onChange: jest.fn(),
            defaultValue: new Date('2020-01-02'),
            withTime: true
        };

        const result = createDateQueryParam(props);

        // Call the serialize function and check that it returns the correct value
        expect(result.serialize?.(new Date('2020-01-03'))).toEqual('2020-01-03T00:00:00');
    });
});
