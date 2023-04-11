import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

/**
 * Builds a query param for a boolean value.
 *
 * @param props - The props for the query param function {@link CreateQueryParamProps}
 *
 * @returns A query param to be used in the `useQueryParams` hook {@link NextQueryParam}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *  const [bool, setBool] = useState(true);
 *  useNextQueryParams({
 *    bool: createBoolQueryParam({
 *      value: bool,
 *      onChange: setBool,
 *    }),
 *  });
 *  return <div>Hello {bool ? 'World' : 'Universe'}</div>;
 *  // ?bool=true
 * }
 * ```
 */
export const createBoolQueryParam = createQueryParamFunctionFactory<boolean>((props) => ({
    value: props.value,
    serialize:
        props.serialize ||
        ((v) => {
            if (v === undefined || v === null) {
                return v;
            }
            return v.toString();
        }),
    onChange: (v) => {
        if (props.deserialize) {
            props.onChange(props.deserialize(v));
            return;
        }
        if (Array.isArray(v)) {
            if (v[0] === 'true') {
                props.onChange(true);
            } else if (v[0] === 'false') {
                props.onChange(false);
            }
        } else {
            if (v === 'true') {
                props.onChange(true);
            } else if (v === 'false') {
                props.onChange(false);
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
                : false;
        /**
         * @note The usage of `any` in the following is necessary because TypeScript is unable to
         * infer the generic types N and O in `createQueryParamFunction` without exposing them, making it
         * impossible to maintain complete type safety for the `props.onChange` argument here.
         * To ensure correctness, be cautious and thoroughly test this code.
         */
        props.onChange(defaultValue as any);
    }
}));
