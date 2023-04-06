import { createObjQueryParam } from '../../src';

describe('createObjQueryParam', () => {
    it('returns an object with the correct value and onChange function', () => {
        const props = {
            value: { foo: 'bar' },
            onChange: jest.fn(),
            defaultValue: { baz: 'qux' }
        };
        const result = createObjQueryParam(props);

        expect(result).toEqual({
            value: { foo: 'bar' },
            onChange: expect.any(Function),
            onReset: expect.any(Function)
        });

        // Call the onChange function with a valid JSON string and check that it passes the parsed value correctly
        result.onChange('{"hello": "world"}');
        expect(props.onChange).toHaveBeenCalledWith({ hello: 'world' });

        // Call the onChange function with an invalid JSON string and check that it's ignored
        result.onChange('not a valid JSON string');
        expect(props.onChange).not.toHaveBeenCalledWith('not a valid JSON string');

        // Call the onChange function with an array containing a valid JSON string and check that it passes the parsed value correctly
        result.onChange(['{"abc": "def"}']);
        expect(props.onChange).toHaveBeenCalledWith({ abc: 'def' });

        // Call the onReset function and check that it resets the value to the default value
        result.onReset();
        expect(props.onChange).toHaveBeenCalledWith({ baz: 'qux' });
    });
});
