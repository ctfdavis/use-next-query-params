import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

export const createJSONRecordQueryParam = createQueryParamFunctionFactory<Record<string, any>>(
    (props) => ({
        value: props.value,
        serialize:
            props.serialize ||
            ((v) => {
                if (v === undefined || v === null) {
                    return v;
                }
                return JSON.stringify(v);
            }),
        onChange: (v) => {
            if (props.deserialize) {
                props.onChange(props.deserialize(v));
                return;
            }
            let parsed;
            try {
                if (Array.isArray(v)) {
                    parsed = JSON.parse(v[0]);
                } else {
                    parsed = JSON.parse(v);
                }
            } catch (e) {
                return;
            }
            if (isJSONRecord(parsed)) {
                props.onChange(parsed);
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
                    : {};
            /**
             * @note The usage of `any` in the following is necessary because TypeScript is unable to
             * infer the generic types N and O in `createQueryParamFunction` without exposing them, making it
             * impossible to maintain complete type safety for the `props.onChange` argument here.
             * To ensure correctness, be cautious and thoroughly test this code.
             */
            props.onChange(defaultValue as any);
        }
    })
);

function isJSONRecord(value: unknown): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
