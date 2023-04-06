import { NextQueryParam } from '../../../types';

type CreateObjQueryParamProps<T extends object> = {
    value: T;
    onChange: (value: T) => void;
    defaultValue: T;
};

export function createObjQueryParam<T extends object>(
    props: CreateObjQueryParamProps<T>
): NextQueryParam {
    return {
        value: props.value,
        onChange: (v) => {
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
            if (typeof parsed === 'object' && parsed !== null) {
                props.onChange(parsed);
            }
        },
        onReset: () => {
            props.onChange(props.defaultValue);
        }
    };
}
