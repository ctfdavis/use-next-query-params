import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

/**
 * Builds a query param for a number array value.
 *
 * @param props - The props for the query param function {@link CreateQueryParamProps}
 *
 * @returns A query param to be used in the `useQueryParams` hook {@link NextQueryParam}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [numArr, setNumArr] = useState([1, 2, 3]);
 *   useNextQueryParams({
 *     numArr: createNumArrQueryParam({
 *       value: numArr,
 *       onChange: setNumArr,
 *     }),
 *   });
 *   return <div>Hello {numArr.join(', ')}</div>;
 *   // ?numArr=1&numArr=2&numArr=3
 * }
 */
export const createNumArrQueryParam = createQueryParamFunctionFactory<number[]>((props) => ({
    value: props.value,
    serialize: props.serialize,
    onChange: (v) => {
        if (props.deserialize) {
            props.onChange(props.deserialize(v));
            return;
        }
        if (Array.isArray(v)) {
            props.onChange(v.filter((v) => !isNaN(Number(v))).map((v) => Number(v)));
        } else {
            if (!isNaN(Number(v))) {
                props.onChange([Number(v)]);
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
