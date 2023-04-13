import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

/**
 * Builds a query param for a number value.
 *
 * @param props - The props for the query param function {@link CreateQueryParamProps}
 *
 * @returns A query param to be used in the `useQueryParams` hook {@link NextQueryParam}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *  const [num, setNum] = useState(0);
 *  useNextQueryParams({
 *    num: createNumQueryParam({
 *      value: num,
 *      onChange: setNum,
 *    }),
 *  });
 *  return <div>Hello {num}</div>;
 *  // ?num=0
 * }
 * ```
 */
export const createNumQueryParam = createQueryParamFunctionFactory<number>((props) => ({
    value: props.value,
    serialize: props.serialize,
    onChange: (v) => {
        if (props.deserialize) {
            props.onChange(props.deserialize(v));
            return;
        }
        if (Array.isArray(v)) {
            if (!isNaN(Number(v[0]))) {
                props.onChange(Number(v[0]));
            }
        } else {
            if (!isNaN(Number(v))) {
                props.onChange(Number(v));
            }
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
                : 0;
        /**
         * @note The usage of `any` in the following is necessary because TypeScript is unable to
         * infer the generic types TNullable and TOptional in `createQueryParamFunction` without exposing them, making it
         * impossible to maintain complete type safety for the `props.onChange` argument here.
         * To ensure correctness, be cautious and thoroughly test this code.
         */
        props.onChange(defaultValue as any);
    }
}));
