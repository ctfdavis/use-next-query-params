import { NextQueryParam } from '../../../types';

type CreateStrArrQueryParam = {
    value: string[];
    onChange: (value: string[]) => void;
    defaultValue?: string[];
};

export function createStrArrQueryParam(props: CreateStrArrQueryParam): NextQueryParam {
    return {
        value: props.value,
        defaultValue: props.defaultValue !== undefined ? props.defaultValue : [],
        onChange: (v) => {
            if (Array.isArray(v)) {
                props.onChange(v);
            } else {
                props.onChange([v]);
            }
        }
    };
}
