import { CreateQueryParamProps, NextQueryParam } from '../../../types';
import { CreateQueryParam } from '../../../types/CreateQueryParam';
import { AllowedType } from '../../../types/AllowedType';

export function createQueryParamFunctionFactory<T, E extends Record<string, any> = object>(
    implementation: <N extends boolean, O extends boolean>(
        props: CreateQueryParamProps<T, N, O, E>
    ) => NextQueryParam<AllowedType<T, N, O>>
): CreateQueryParam<T, E> {
    return function <N extends boolean = false, O extends boolean = false>(
        props: CreateQueryParamProps<T, N, O, E>
    ): NextQueryParam<AllowedType<T, N, O>> {
        return implementation(props);
    };
}
