import { AllowedType } from './AllowedType';

export type CreateQueryParamProps<
    T,
    N extends boolean,
    O extends boolean,
    E extends Record<string, any> = object
> = Omit<
    {
        /**
         * The value of the query param state. This is the value that will be used to update the url query param.
         */
        value: AllowedType<T, N, O>;
        /**
         * A function that will be called when the corresponding url query param changes. It is used to update the query param state.
         * @param value
         */
        onChange: (value: AllowedType<T, N, O>) => void;
        /**
         * Deserialize a value from a parsed url query into the type of the query param.
         * @note If you are using a custom `serialize` function, you should also provide a custom `deserialize` function. They must be inverses of each other.
         */
        deserialize?: (value: string | string[]) => AllowedType<T, N, O>;
        /**
         * Serialize a value from the query param into a parsed url query (i.e., string or array of strings).
         * @note If you are using a custom `deserialize` function, you should also provide a custom `serialize` function. They must be inverses of each other.
         */
        serialize?: (value: AllowedType<T, N, O>) => string | string[];
        /**
         * The default value of the query param state. Used to reset the state value when the corresponding url query param is removed and `mode` in the adapter interface is set to `reset` {@link NextQueryParamsAdapter}.
         */
        defaultValue?: AllowedType<T, N, O>;
        /**
         * Whether the query param is nullable.
         */
        nullable?: N;
        /**
         * Whether the query param is optional (i.e. whether it can be `undefined`).
         */
        optional?: O;
    },
    keyof E
> &
    E;
