export function areUrlQueryValuesEqual(a: string | string[], b: string | string[]): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    } else if (typeof a === 'string' && typeof b === 'string') {
        return a === b;
    }
    return false;
}
