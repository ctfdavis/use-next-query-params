export type NextQueryParam = {
    readonly value: any;
    readonly onChange: (value: string | string[]) => void;
    readonly defaultValue: any;
};

export type NextQueryParams = {
    [key: string]: NextQueryParam;
};
