import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

export const createDateQueryParam = createQueryParamFunctionFactory<
    Date,
    {
        withTime?: boolean;
    }
>((props) => ({
    value: props.value,
    serialize:
        props.serialize ||
        ((v) => {
            if (v === undefined || v === null) {
                return v;
            }
            if (props.withTime) {
                return v.toISOString().split('.')[0];
            }
            return v.toISOString().split('T')[0];
        }),
    onChange: (v) => {
        if (props.deserialize) {
            props.onChange(props.deserialize(v));
            return;
        }
        if (Array.isArray(v)) {
            const parsedDate = new Date(v[0]);
            if (!isNaN(parsedDate.getTime())) {
                props.onChange(parsedDate);
            }
        } else {
            const parsedDate = new Date(v);
            if (!isNaN(parsedDate.getTime())) {
                props.onChange(parsedDate);
            }
        }
    },
    onReset: () => {
        const defaultValue = props.defaultValue
            ? new Date(props.defaultValue)
            : props.nullable
            ? null
            : props.optional
            ? undefined
            : new Date();
        /**
         * @note The usage of `any` in the following is necessary because TypeScript is unable to
         * infer the generic types N and O in `createQueryParamFunction` without exposing them, making it
         * impossible to maintain complete type safety for the `props.onChange` argument here.
         * To ensure correctness, be cautious and thoroughly test this code.
         */
        props.onChange(defaultValue as any);
    }
}));
