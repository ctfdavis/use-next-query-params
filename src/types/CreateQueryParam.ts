import { CreateQueryParamProps } from './CreateQueryParamProps';
import { NextQueryParam } from './NextQueryParams';
import { AllowedType } from './AllowedType';

/**
 * Returned function by query param builders
 *
 * @see Built-in query param builders:
 * {@link createStrQueryParam}
 * {@link createNumQueryParam}
 * {@link createBoolQueryParam}
 * {@link createDateQueryParam}
 * {@link createJSONRecordQueryParam}
 * {@link createStrArrQueryParam}
 * {@link createNumArrQueryParam}
 *
 * @see Query param builder factory function:
 * {@link createQueryParamFunctionFactory}
 */
export type CreateQueryParam<T, E extends Record<string, any>> = <
    N extends boolean = false,
    O extends boolean = false
>(
    props: CreateQueryParamProps<T, N, O, E>
) => NextQueryParam<AllowedType<T, N, O>>;
