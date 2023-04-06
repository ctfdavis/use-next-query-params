import { NextQueryParam } from '../../../types';

type CreateStrQueryParamProps = {
    value: string;
    onChange: (value: string) => void;
    defaultValue?: string;
};

export function createStrQueryParam(props: CreateStrQueryParamProps): NextQueryParam {
    return {
        value: props.value,
        onChange: (v) => {
            if (Array.isArray(v)) {
                props.onChange(v[0]);
            } else {
                props.onChange(v);
            }
        },
        onReset: () => {
            props.onChange(props.defaultValue !== undefined ? props.defaultValue : '');
        }
    };
}
