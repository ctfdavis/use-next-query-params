import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

/**
 * Builds a query param for a string value.
 *
 * @param props - The props for the query param function {@link CreateQueryParamProps}
 *
 * @returns A query param to be used in the `useQueryParams` hook {@link NextQueryParam}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [str, setStr] = useState('foo');
 *   useNextQueryParams({
 *     str: createStrQueryParam({
 *       value: str,
 *       onChange: setStr,
 *     }),
 *   });
 *   return <div>Hello {str}</div>;
 *   // ?str=foo
 * }
 * ```
 */
export const createStrQueryParam = createQueryParamFunctionFactory<string>((props) => ({
    value: props.value,
    serialize: props.serialize || ((v) => v),
    onChange: (v) => {
        if (props.deserialize) {
            props.onChange(props.deserialize(v));
            return;
        }
        if (Array.isArray(v)) {
            props.onChange(v[0]);
        } else {
            props.onChange(v);
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
                : '';
        /**
         * @note The usage of `any` in the following is necessary because TypeScript is unable to
         * infer the generic types N and O in `createQueryParamFunction` without exposing them, making it
         * impossible to maintain complete type safety for the `props.onChange` argument here.
         * To ensure correctness, be cautious and thoroughly test this code.
         */
        props.onChange(defaultValue as any);
    }
}));
