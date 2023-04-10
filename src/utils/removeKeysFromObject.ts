export function removeKeysFromObject<T extends Record<string, unknown>>(
    obj: T,
    keys: string[]
): Omit<T, keyof any> {
    return Object.keys(obj)
        .filter((key) => !keys.includes(key))
        .reduce((acc, key) => {
            (acc as any)[key] = (obj as any)[key];
            return acc;
        }, {} as Omit<T, keyof any>);
}
