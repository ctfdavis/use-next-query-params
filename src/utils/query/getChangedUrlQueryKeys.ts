import { ParsedUrlQuery } from 'querystring';
import { areUrlQueryValuesEqual } from './areUrlQueryValuesEqual';

export function getChangedUrlQueryKeys(a: ParsedUrlQuery, b: ParsedUrlQuery): string[] {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const allKeys = Array.from(new Set([...aKeys, ...bKeys]));

    return allKeys.filter((key) => {
        const aValue = a[key] as string | string[];
        const bValue = b[key] as string | string[];
        return (
            aValue === undefined || bValue === undefined || !areUrlQueryValuesEqual(aValue, bValue)
        );
    });
}
