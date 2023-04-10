export type NextQueryParam<T> = {
    readonly value: T;
    readonly onChange: (value: string | string[]) => void;
    readonly onReset: () => void;
    readonly serialize?: (value: T) => string | string[] | undefined | null;
};

export type NextQueryParams<T extends Record<string, unknown> = Record<string, any>> = {
    [K in keyof T]: NextQueryParam<T[K]>;
};
