import { removeKeysFromObject } from '../src/utils/removeKeysFromObject';

describe('removeKeysFromObject', () => {
    it('should remove the specified keys from the object', () => {
        const obj = {
            a: '123',
            b: 'b',
            c: ['you'],
            d: 'see'
        };

        const keys = ['a', 'c', 'e'];

        const result = removeKeysFromObject(obj, keys);

        expect(result).toEqual({
            b: 'b',
            d: 'see'
        });
    });

    it('should return an empty object if all keys are removed', () => {
        const obj = {
            a: '123',
            b: 'b'
        };

        const keys = ['a', 'b'];

        const result = removeKeysFromObject(obj, keys);

        expect(result).toEqual({});
    });

    it('should return the original object if no keys are removed', () => {
        const obj = {
            a: '123',
            b: 'b'
        };

        const keys = ['c', 'd'];

        const result = removeKeysFromObject(obj, keys);

        expect(result).toEqual(obj);
    });

    it('should not mutate the original object', () => {
        const obj = {
            a: '123',
            b: 'b',
            c: ['you'],
            d: 'see'
        };

        const originalObj = { ...obj };
        const keys = ['a', 'c', 'e'];

        removeKeysFromObject(obj, keys);

        expect(obj).toEqual(originalObj);
    });
});
