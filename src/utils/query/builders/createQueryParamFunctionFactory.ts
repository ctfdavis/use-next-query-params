import { CreateQueryParamProps, NextQueryParam } from '../../../types';
import { CreateQueryParam } from '../../../types/CreateQueryParam';
import { AllowedType } from '../../../types/AllowedType';

/**
 * Creates a query param builder function.
 *
 * @param implementation - The implementation function of the query param builder function
 * @remarks
 * The implementation function accepts the props for a query param builder function {@link CreateQueryParamProps}
 * and returns a query param object that can be used with the `useQueryParams` hook. {@link NextQueryParam}
 *
 */
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
