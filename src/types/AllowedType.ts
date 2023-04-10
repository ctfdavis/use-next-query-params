export type AllowedType<T, N, O> =
    | T
    | (N extends true ? null : never)
    | (O extends true ? undefined : never);
