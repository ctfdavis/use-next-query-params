export type AllowedType<TData, TNullable, TOptional> =
    | TData
    | (TNullable extends true ? null : never)
    | (TOptional extends true ? undefined : never);
