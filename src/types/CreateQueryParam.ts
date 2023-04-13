import { CreateQueryParamProps } from './CreateQueryParamProps';
import { NextQueryParam } from './NextQueryParams';
import { AllowedType } from './AllowedType';

/**
 * Function returned by query param builders
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
export type CreateQueryParam<TData, TExtra extends Record<string, any>> = <
    TNullable extends boolean = false,
    TOptional extends boolean = false
>(
    props: CreateQueryParamProps<TData, TNullable, TOptional, TExtra>
) => NextQueryParam<AllowedType<TData, TNullable, TOptional>>;
