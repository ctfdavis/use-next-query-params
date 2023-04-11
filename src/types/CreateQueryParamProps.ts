import { AllowedType } from './AllowedType';

export type CreateQueryParamProps<
    T,
    N extends boolean,
    O extends boolean,
    E extends Record<string, any> = object
> = Omit<
    {
        value: AllowedType<T, N, O>;
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
        defaultValue?: AllowedType<T, N, O>;
        nullable?: N;
        optional?: O;
    },
    keyof E
> &
    E;
