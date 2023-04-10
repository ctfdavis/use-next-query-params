import { SerializeQueryParam } from '../../types/SerializeQueryParam';

export const baseSerializeQueryParam: SerializeQueryParam = (value: unknown) => {
    if (isInvalidValue(value)) {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value
            .filter((v) => !isInvalidValue(v))
            .map((v) => (typeof v === 'object' ? JSON.stringify(v) : v.toString()));
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value, function (_key, value) {
            if (typeof value === 'number' && isNaN(value)) {
                return 'NaN';
            }
            if (value === Infinity) {
                return 'Infinity';
            }
            if (value === -Infinity) {
                return '-Infinity';
            }
            if (value !== null && isInvalidValue(value)) {
                return undefined;
            }
            if (
                typeof value === 'object' &&
                !isEmptyObject(value) &&
                JSON.stringify(value) === '{}'
            ) {
                return undefined;
            }
            return value;
        });
    }
    return value?.toString();
};

function isInvalidValue(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        (typeof value === 'number' && isNaN(value)) ||
        typeof value === 'symbol' ||
        typeof value === 'function' ||
        typeof value === 'bigint'
    );
}

function isEmptyObject(value: unknown) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    return Object.keys(value).length === 0;
}
