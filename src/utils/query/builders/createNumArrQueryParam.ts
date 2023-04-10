import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

export const createNumArrQueryParam = createQueryParamFunctionFactory<number[]>((props) => ({
    value: props.value,
    serialize: props.serialize,
    onChange: (v) => {
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
