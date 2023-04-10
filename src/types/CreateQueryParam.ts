import { CreateQueryParamProps } from './CreateQueryParamProps';
import { NextQueryParam } from './NextQueryParams';
import { AllowedType } from './AllowedType';

export type CreateQueryParam<T, E extends Record<string, any>> = <
    N extends boolean = false,
    O extends boolean = false
>(
    props: CreateQueryParamProps<T, N, O, E>
) => NextQueryParam<AllowedType<T, N, O>>;
