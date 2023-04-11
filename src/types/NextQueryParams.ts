export type NextQueryParam<T> = {
    /**
     * The value of the query param state.
     */
    readonly value: T;
    /**
     * A function that is called to update the query param state when the corresponding URL query param changes.
     */
    readonly onChange: (value: string | string[]) => void;
    /**
     * A function to reset the query param state to its default value. It is called when `mode` in the adapter interface is set to `reset` {@link NextQueryParamsAdapter} and the corresponding URL query param is removed.
     */
    readonly onReset: () => void;
    /**
     * A function to serialize the query param state to a string, array of strings, undefined, or null. If provided, it will be used to serialize the query param state when it is updated.
     *
     * @remarks
     * If not provided, the default serialization function `baseSerializeQueryParam` {@link baseSerializeQueryParam} will be used to serialize the query param state.
     */
    readonly serialize?: (value: T) => string | string[] | undefined | null;
};

export type NextQueryParams<T extends Record<string, unknown> = Record<string, any>> = {
    [K in keyof T]: NextQueryParam<T[K]>;
};
