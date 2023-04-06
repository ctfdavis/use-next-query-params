import { ParsedUrlQuery } from 'querystring';
import { areQueryParamValuesEqual } from './areQueryParamValuesEqual';

export function areQueryParamsEqual(a: ParsedUrlQuery, b: ParsedUrlQuery): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length || !aKeys.every((key) => bKeys.includes(key))) {
        return false;
    }
    return aKeys.every((key) => {
        const aValue = a[key] as string | string[];
        const bValue = b[key] as string | string[];
        return areQueryParamValuesEqual(aValue, bValue);
    });
}
