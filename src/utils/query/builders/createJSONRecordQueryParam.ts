import { createQueryParamFunctionFactory } from './createQueryParamFunctionFactory';

export const createJSONRecordQueryParam = createQueryParamFunctionFactory<
    Record<string, any>,
    {
        defaultValue: Record<string, any>;
    }
>((props) => ({
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
        props.onChange(props.defaultValue);
    }
}));

function isJSONRecord(value: unknown): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
