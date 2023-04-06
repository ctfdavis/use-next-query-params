import { NextQueryParam } from '../../../types';

type CreateNumQueryParamProps = {
    value: number;
    onChange: (value: number) => void;
    defaultValue?: number;
};

export function createNumQueryParam(props: CreateNumQueryParamProps): NextQueryParam {
    return {
        value: props.value,
        onChange: (v) => {
            if (Array.isArray(v)) {
                if (!isNaN(Number(v[0]))) {
                    props.onChange(Number(v[0]));
                }
            } else {
                if (!isNaN(Number(v))) {
                    props.onChange(Number(v));
                }
            }
        },
        onReset: () => {
            props.onChange(props.defaultValue !== undefined ? props.defaultValue : 0);
        }
    };
}
