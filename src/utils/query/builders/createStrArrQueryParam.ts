import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

/**
 * Builds a query param for a string array value.
 *
 * @param props - The props for the query param function {@link CreateQueryParamProps}
 *
 * @returns A query param to be used in the `useQueryParams` hook {@link NextQueryParam}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [strArr, setStrArr] = useState(['foo', 'bar']);
 *   useNextQueryParams({
 *     strArr: createStrArrQueryParam({
 *       value: strArr,
 *       onChange: setStrArr,
 *     }),
 *   });
 *   return <div>Hello {strArr.join(', ')}</div>;
 *   // ?strArr=foo&strArr=bar
 * }
 */
export const createStrArrQueryParam = createQueryParamFunctionFactory<string[]>((props) => ({
    value: props.value,
    serialize: props.serialize,
    onChange: (v) => {
        if (props.deserialize) {
            props.onChange(props.deserialize(v));
            return;
        }
        if (Array.isArray(v)) {
            props.onChange(v);
        } else {
            props.onChange([v]);
        }
    },
    onReset: () => {
        const defaultValue =
            props.defaultValue !== undefined
                ? props.defaultValue
                : props.nullable
                ? null
                : props.optional
                ? undefined
                : [];
        /**
         * @note The usage of `any` in the following is necessary because TypeScript is unable to
         * infer the generic types N and O in `createQueryParamFunction` without exposing them, making it
         * impossible to maintain complete type safety for the `props.onChange` argument here.
         * To ensure correctness, be cautious and thoroughly test this code.
         */
        props.onChange(defaultValue as any);
    }
}));
