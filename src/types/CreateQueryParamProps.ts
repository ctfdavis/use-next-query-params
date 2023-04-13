import { AllowedType } from './AllowedType';
import { SerializeQueryParam } from './SerializeQueryParam';

export type CreateQueryParamProps<
    TData,
    TNullable extends boolean,
    TOptional extends boolean,
    TExtra extends Record<string, any> = object
> = Omit<
    {
        /**
         * The value of the query param state. This value will be used to update the URL query param.
         */
        value: AllowedType<TData, TNullable, TOptional>;
        /**
         * A function that will be called when the corresponding URL query param changes. It is used to update the query param state.
         * @param value
         */
        onChange: (value: AllowedType<TData, TNullable, TOptional>) => void;
        /**
         * Deserialize a value from a parsed URL query into the type of the query param.
         * @note If you are using a custom `serialize` function, you should also provide a custom `deserialize` function. They must be inverses of each other.
         */
        deserialize?: (value: string | string[]) => AllowedType<TData, TNullable, TOptional>;
        /**
         * Serialize a value from the query param into a parsed URL query (i.e., string or array of strings).
         * @note If you are using a custom `deserialize` function, you should also provide a custom `serialize` function. They must be inverses of each other.
         */
        serialize?: SerializeQueryParam<AllowedType<TData, TNullable, TOptional>>;
        /**
         * The default value of the query param state. It is used to reset the state value when the corresponding URL query param is removed and `mode` in the adapter is set to `reset` {@link NextQueryParamsAdapter}.
         */
        defaultValue?: AllowedType<TData, TNullable, TOptional>;
        /**
         * Whether the query param is nullable.
         */
        nullable?: TNullable;
        /**
         * Whether the query param is optional (i.e. whether it can be `undefined`).
         */
        optional?: TOptional;
    },
    keyof TExtra
> &
    TExtra;
