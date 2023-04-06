export type NextQueryParam = {
    readonly value: any;
    readonly onChange: (value: string | string[]) => void;
    readonly onReset: () => void;
};

export type NextQueryParams = {
    [key: string]: NextQueryParam;
};
