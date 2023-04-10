import { ParsedUrlQuery } from 'querystring';
import { areUrlQueryValuesEqual } from './areUrlQueryValuesEqual';

export function areUrlQueriesEqual(a: ParsedUrlQuery, b: ParsedUrlQuery): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length || !aKeys.every((key) => bKeys.includes(key))) {
        return false;
    }
    return aKeys.every((key) => {
        const aValue = a[key] as string | string[];
        const bValue = b[key] as string | string[];
        return areUrlQueryValuesEqual(aValue, bValue);
    });
}
